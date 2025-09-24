import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const DispatcherDashboardPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  
  const { 
    dispatcher, 
    logoutDispatcher, 
    formatMXN,
    allProductsWithStock,
    isLoadingProducts,
    refreshProductsStock 
  } = useCart();
  
  const navigate = useNavigate();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const [activeTab, setActiveTab] = useState('orders');
  const [stockInputs, setStockInputs] = useState({});
  const [isUpdatingStock, setIsUpdatingStock] = useState(null);
  const [stockError, setStockError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!dispatcher || activeTab !== 'orders') return;
    setIsLoadingOrders(true);
    setOrdersError(''); 
    try {
      const pendingResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/pending`);
      if (!pendingResponse.ok) { const errData = await pendingResponse.json().catch(() => ({})); throw new Error(errData.message || 'Error al cargar órdenes pendientes'); }
      const pendingData = await pendingResponse.json();
      setPendingOrders(pendingData);

      const shippedResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/shipped`);
      if (!shippedResponse.ok) { const errData = await shippedResponse.json().catch(() => ({})); throw new Error(errData.message || 'Error al cargar órdenes despachadas'); }
      const shippedData = await shippedResponse.json();
      setShippedOrders(shippedData);
    } catch (err) {
      setOrdersError(err.message);
      setPendingOrders([]);
      setShippedOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [dispatcher, backendApiUrl, activeTab]);

  useEffect(() => {
    if (!isLoadingProducts && !dispatcher) {
      navigate('/dispatcher-login');
    } else if (dispatcher) {
      if (activeTab === 'orders') {
        fetchOrders();
      }
      if (allProductsWithStock.length > 0) {
        const initialInputs = {};
        allProductsWithStock.forEach(p => {
          initialInputs[p.id || p.name] = p.stock.toString();
        });
        setStockInputs(initialInputs);
      }
    }
  }, [dispatcher, navigate, fetchOrders, activeTab, isLoadingProducts, allProductsWithStock]);

  const handleStockInputChange = (productId, value) => {
    setStockInputs(prev => ({ ...prev, [productId]: value }));
  };

  const handleUpdateStock = async (productId, currentInputStock, productName) => {
    const newStock = parseInt(currentInputStock, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert("Por favor, ingresa un número válido para el stock.");
      const product = allProductsWithStock.find(p => (p.id || p.name) === productId);
      if (product) setStockInputs(prev => ({ ...prev, [productId]: product.stock.toString() }));
      return;
    }
    setIsUpdatingStock(productId);
    setStockError('');
    try {
      const response = await fetch(`${backendApiUrl}/api/dispatcher/product/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStock }),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Error al actualizar el stock');
      
      alert(`Stock para "${productName}" actualizado a ${newStock}`);
      if (refreshProductsStock) refreshProductsStock();
    } catch (err) {
      setStockError(err.message || 'Fallo al actualizar el stock.');
      alert(`Error: ${err.message}`);
      const product = allProductsWithStock.find(p => (p.id || p.name) === productId);
      if (product) setStockInputs(prev => ({ ...prev, [productId]: product.stock.toString() }));
    } finally {
      setIsUpdatingStock(null);
    }
  };

  const handleMarkAsShipped = async (orderId) => {
    const trackingNumber = prompt("Opcional: Ingresa el número de seguimiento para esta orden:");
    setIsLoadingOrders(true);
    setOrdersError('');
    try {
      const response = await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/dispatch`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ trackingNumber: trackingNumber || undefined })
      });
      if (!response.ok) { const errData = await response.json().catch(() => ({})); throw new Error(errData.message || 'Error al marcar como despachada'); }
      await fetchOrders();
    } catch (err) {
      setOrdersError(err.message || 'Fallo al actualizar la orden.');
      setIsLoadingOrders(false);
    }
  };

  const handleUnshipOrder = async (orderId) => {
    if (!window.confirm("¿Estás seguro de que quieres marcar esta orden como NO despachada?")) return;
    setIsLoadingOrders(true);
    setOrdersError('');
    try {
        const response = await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/unship`, { method: 'PUT', headers: { 'Content-Type': 'application/json', }, });
        if (!response.ok) { const errData = await response.json().catch(() => ({})); throw new Error(errData.message || 'Error al revertir el despacho'); }
        await fetchOrders();
    } catch (err) {
        setOrdersError(err.message || 'Fallo al actualizar la orden.');
        setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => { logoutDispatcher(); navigate('/dispatcher-login'); };
  
  const renderOrderCard = (order, isPending = false) => (
    <div key={order._id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">Orden #{order._id ? order._id.slice(-6) : 'N/A'}</h2>
        <p className="text-sm text-gray-400 mb-1">Fecha Pedido: {new Date(order.createdAt).toLocaleString()}</p>
        {order.shippedAt && <p className="text-sm text-green-400 mb-1">Fecha Despacho: {new Date(order.shippedAt).toLocaleString()}</p>}
        <p className="text-sm text-gray-400 mb-3">Total: <span className="font-bold">{formatMXN ? formatMXN(order.totalAmount) : `$${order.totalAmount}`}</span></p>
        <p className="text-sm text-gray-400 mb-3">Estado: <span className={`font-semibold ${order.status === 'paid' ? 'text-green-400' : order.status === 'shipped' ? 'text-blue-400' : 'text-red-400'}`}>{order.status}</span></p>
        {order.referredByEmployeeName ? ( <div className="mb-3 pt-2 border-t border-gray-700 mt-2"> <h4 className="font-medium text-gray-200">Vendido por:</h4> <p className="text-sm text-green-400 font-semibold">{order.referredByEmployeeName}</p> </div>
        ) : order.referralCode ? ( <div className="mb-3 pt-2 border-t border-gray-700 mt-2"> <h4 className="font-medium text-gray-200">Cód. Referido:</h4> <p className="text-sm text-gray-300 font-semibold">{order.referralCode}</p> </div>
        ) : null}
        <div className="mb-3"> <h4 className="font-medium text-gray-200">Cliente:</h4> <p className="text-sm text-gray-300">{order.customerDetails.name}</p> <p className="text-sm text-gray-300">{order.customerDetails.email}</p> <p className="text-sm text-gray-300">{order.customerDetails.phone}</p> </div>
        <div className="mb-4"> <h4 className="font-medium text-gray-200">Dirección de Envío:</h4> <p className="text-sm text-gray-300">{order.customerDetails.address}</p> <p className="text-sm text-gray-300">{order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.postalCode}</p> </div>
        <div className="mb-4"> <h4 className="font-medium text-gray-200 mb-1">Productos:</h4> <ul className="list-disc list-inside space-y-1 pl-1"> {order.items.map((item, index) => ( <li key={index} className="text-sm text-gray-300"> {item.quantity} x {item.name} ({item.presentation}) </li> ))} </ul> </div>
        {order.shippingDetails?.trackingNumber && ( <div className="mb-4"> <h4 className="font-medium text-gray-200">Nº Seguimiento:</h4> <p className="text-sm text-yellow-400 font-semibold">{order.shippingDetails.trackingNumber}</p> </div> )}
      </div>
      <div className="mt-4 space-y-2">
        {isPending && ( <button onClick={() => handleMarkAsShipped(order._id)} disabled={isLoadingOrders} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"> Marcar como Despachado </button> )}
        {!isPending && order.status === 'shipped' && ( <button onClick={() => handleUnshipOrder(order._id)} disabled={isLoadingOrders} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"> Revertir Despacho </button> )}
      </div>
    </div>
  );

  if (!dispatcher && !isLoadingProducts) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Panel de Despacho</h1>
          {dispatcher && (
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto" > Cerrar Sesión </button>
          )}
        </div>

        <div className="mb-8 flex space-x-2 sm:space-x-4 border-b-2 border-gray-700">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 sm:px-4 rounded-t-lg text-sm sm:text-base font-semibold transition-colors ${activeTab === 'orders' ? 'bg-gray-700 text-yellow-300 border-b-2 border-transparent' : 'text-gray-400 hover:text-yellow-200 hover:bg-gray-800/50'}`}
          >
            Gestionar Órdenes
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-3 sm:px-4 rounded-t-lg text-sm sm:text-base font-semibold transition-colors ${activeTab === 'inventory' ? 'bg-gray-700 text-yellow-300 border-b-2 border-transparent' : 'text-gray-400 hover:text-yellow-200 hover:bg-gray-800/50'}`}
          >
            Gestionar Inventario
          </button>
        </div>

        {activeTab === 'orders' && (
          <>
            {isLoadingOrders ? (
              <p className="text-center text-gray-400 text-lg py-10">Cargando órdenes...</p>
            ) : ordersError ? (
              <p className="text-red-500 bg-red-900/50 p-3 rounded-md text-center mb-6">{ordersError}</p>
            ) : (
              <>
                <section className="mb-12">
                  <h2 className="text-xl sm:text-2xl font-semibold text-yellow-300 border-b-2 border-yellow-600 pb-2 mb-6">Pendientes de Envío ({pendingOrders.length})</h2>
                  {pendingOrders.length === 0 && !isLoadingOrders && <p className="text-gray-400">No hay órdenes pendientes.</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingOrders.map(order => renderOrderCard(order, true))}
                  </div>
                </section>
                <section>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-300 border-b-2 border-gray-700 pb-2 mb-6">Envíos Realizados ({shippedOrders.length})</h2>
                  {shippedOrders.length === 0 && !isLoadingOrders && <p className="text-gray-400">No hay órdenes despachadas.</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shippedOrders.map(order => renderOrderCard(order, false))}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activeTab === 'inventory' && (
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-300 border-b-2 border-teal-600 pb-2 mb-6">Inventario de Productos</h2>
            {isLoadingProducts ? (
              <p className="text-gray-400">Cargando inventario...</p>
            ) : stockError ? (
              <p className="text-red-500 bg-red-900/50 p-3 rounded-md text-center">{stockError}</p>
            ) : allProductsWithStock.length === 0 ? (
              <p className="text-gray-400">No hay productos para gestionar.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {allProductsWithStock.map(product => {
                  const currentProdId = product.id || product.name;
                  return (
                    <div key={currentProdId} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col">
                      <img src={product.modelPath} alt={product.name} className="w-full h-32 object-contain rounded mb-3 bg-black/20 p-2"/>
                      <h3 className="text-sm font-semibold text-yellow-300 truncate h-10 leading-tight flex items-center" title={product.name}>{product.name}</h3>
                      <p className="text-xs text-gray-400 mb-2 truncate">{product.presentation}</p>
                      <div className="mt-auto space-y-2">
                        <label htmlFor={`stock-${currentProdId}`} className="block text-xs font-medium text-gray-300">
                          Stock Actual: <span className={`font-bold ${product.stock > 5 ? 'text-green-400' : product.stock > 0 ? 'text-orange-400' : 'text-red-500'}`}>{product.stock}</span>
                        </label>
                        <input
                          type="number"
                          id={`stock-${currentProdId}`}
                          value={stockInputs[currentProdId] || ''}
                          onChange={(e) => handleStockInputChange(currentProdId, e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                          min="0"
                          placeholder="Nuevo stock"
                        />
                        <button 
                          onClick={() => handleUpdateStock(currentProdId, stockInputs[currentProdId], product.name)}
                          disabled={isUpdatingStock === currentProdId || stockInputs[currentProdId] === undefined || stockInputs[currentProdId] === '' || parseInt(stockInputs[currentProdId], 10) === product.stock}
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isUpdatingStock === currentProdId ? 'Actualizando...' : 'Guardar Stock'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default DispatcherDashboardPage;