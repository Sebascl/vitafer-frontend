import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const DispatcherOrdersPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { dispatcher, logoutDispatcher, formatMXN } = useCart();
  const navigate = useNavigate();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const fetchOrders = useCallback(async () => {
    if (!dispatcher) return;
    setError('');
    try {
      const pendingResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/pending`);
      if (!pendingResponse.ok) {
        const errData = await pendingResponse.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al cargar órdenes pendientes');
      }
      const pendingData = await pendingResponse.json();
      setPendingOrders(pendingData);

      const shippedResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/shipped`);
      if (!shippedResponse.ok) {
        const errData = await shippedResponse.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al cargar órdenes despachadas');
      }
      const shippedData = await shippedResponse.json();
      setShippedOrders(shippedData);
    } catch (err) {
      setError(err.message);
      setPendingOrders([]);
      setShippedOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [dispatcher, backendApiUrl]);

  useEffect(() => {
    if (!dispatcher) {
      navigate('/dispatcher-login');
    } else {
      setIsLoading(true);
      fetchOrders();
    }
  }, [dispatcher, navigate, fetchOrders]);

  const handleMarkAsShipped = async (orderId) => {
    const trackingNumber = prompt("Opcional: Ingresa el número de seguimiento para esta orden:");
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/dispatch`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ trackingNumber: trackingNumber || undefined })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al marcar como despachada');
      }
      await fetchOrders();
    } catch (err) {
      setError(err.message || 'Fallo al actualizar la orden.');
      setIsLoading(false);
    }
  };

  const handleUnshipOrder = async (orderId) => {
    if (!window.confirm("¿Estás seguro de que quieres marcar esta orden como NO despachada?")) {
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const response = await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/unship`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Error al revertir el despacho');
        }
        await fetchOrders();
    } catch (err) {
        setError(err.message || 'Fallo al actualizar la orden.');
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutDispatcher();
    navigate('/dispatcher-login');
  };
  
  const renderOrderCard = (order, isPending = false) => (
    <div key={order._id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">Orden #{order._id ? order._id.slice(-6) : 'N/A'}</h2>
        <p className="text-sm text-gray-400 mb-1">Fecha Pedido: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
        {order.shippedAt && <p className="text-sm text-green-400 mb-1">Fecha Despacho: {new Date(order.shippedAt).toLocaleDateString()} {new Date(order.shippedAt).toLocaleTimeString()}</p>}
        <p className="text-sm text-gray-400 mb-3">Total: <span className="font-bold">{formatMXN ? formatMXN(order.totalAmount) : `$${order.totalAmount}`}</span></p>
        <p className="text-sm text-gray-400 mb-3">Estado: <span className={`font-semibold ${order.status === 'paid' ? 'text-green-400' : order.status === 'shipped' ? 'text-blue-400' : 'text-red-400'}`}>{order.status}</span></p>

        {/* MODIFICACIÓN AQUÍ para mostrar nombre del empleado */}
        {order.referredByEmployeeName ? (
          <div className="mb-3 pt-2 border-t border-gray-700 mt-2">
            <h4 className="font-medium text-gray-200">Vendido por:</h4>
            <p className="text-sm text-green-400 font-semibold">{order.referredByEmployeeName}</p>
          </div>
        ) : order.referralCode ? (
          <div className="mb-3 pt-2 border-t border-gray-700 mt-2">
            <h4 className="font-medium text-gray-200">Cód. Referido:</h4>
            <p className="text-sm text-gray-300 font-semibold">{order.referralCode}</p>
          </div>
        ) : null}

        <div className="mb-3">
          <h4 className="font-medium text-gray-200">Cliente:</h4>
          <p className="text-sm text-gray-300">{order.customerDetails.name}</p>
          <p className="text-sm text-gray-300">{order.customerDetails.email}</p>
          <p className="text-sm text-gray-300">{order.customerDetails.phone}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-200">Dirección de Envío:</h4>
          <p className="text-sm text-gray-300">{order.customerDetails.address}</p>
          <p className="text-sm text-gray-300">{order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.postalCode}</p>
        </div>
                        
        <div className="mb-4">
            <h4 className="font-medium text-gray-200 mb-1">Productos:</h4>
            <ul className="list-disc list-inside space-y-1 pl-1">
                {order.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-300">
                        {item.quantity} x {item.name} ({item.presentation})
                    </li>
                ))}
            </ul>
        </div>
        {order.shippingDetails?.trackingNumber && (
            <div className="mb-4">
                <h4 className="font-medium text-gray-200">Nº Seguimiento:</h4>
                <p className="text-sm text-yellow-400 font-semibold">{order.shippingDetails.trackingNumber}</p>
            </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {isPending && (
          <button 
              onClick={() => handleMarkAsShipped(order._id)}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Marcar como Despachado
          </button>
        )}
        {!isPending && order.status === 'shipped' && (
            <button
                onClick={() => handleUnshipOrder(order._id)}
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
                Revertir Despacho
            </button>
        )}
      </div>
    </div>
  );

  if (!dispatcher && !isLoading) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Panel de Despacho</h1>
          {dispatcher && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          )}
        </div>

        {isLoading && pendingOrders.length === 0 && shippedOrders.length === 0 ? (
            <p className="text-center text-gray-400 text-lg py-10">Cargando órdenes...</p>
        ) : error ? (
            <p className="text-red-500 bg-red-900/50 p-3 rounded-md text-center mb-6">{error}</p>
        ) : (
          <>
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-yellow-300 border-b-2 border-yellow-600 pb-2 mb-6">Pendientes de Envío ({pendingOrders.length})</h2>
                {!isLoading && pendingOrders.length === 0 && <p className="text-gray-400">No hay órdenes pendientes.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingOrders.map(order => renderOrderCard(order, true))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-gray-300 border-b-2 border-gray-700 pb-2 mb-6">Envíos Realizados ({shippedOrders.length})</h2>
                {!isLoading && shippedOrders.length === 0 && <p className="text-gray-400">No hay órdenes despachadas.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shippedOrders.map(order => renderOrderCard(order, false))}
                </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DispatcherOrdersPage;