import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaEye, FaUserPlus, FaSave, FaTimes, FaShippingFast, FaUndo } from 'react-icons/fa';

const DispatcherDashboardPage = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', spins: 0 });
  const [spinUpdates, setSpinUpdates] = useState({});

  const { 
    dispatcher, 
    logoutDispatcher, 
    formatMXN,
    allProductsWithStock,
    isLoadingProducts,
    refreshProductsStock,
    getNumericPrice 
  } = useCart();
  
  const navigate = useNavigate();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const [activeTab, setActiveTab] = useState('orders');
  const [inventoryInputs, setInventoryInputs] = useState({});
  const [isUpdating, setIsUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const pendingResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/pending`);
      setPendingOrders(await pendingResponse.json());
      const shippedResponse = await fetch(`${backendApiUrl}/api/dispatcher/orders/shipped`);
      setShippedOrders(await shippedResponse.json());
    } catch (err) { console.error(err); }
  }, [backendApiUrl]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${backendApiUrl}/api/dispatcher/users`);
      const data = await response.json();
      setUsers(data);
      const initialSpins = {};
      data.forEach(u => initialSpins[u._id] = u.spins);
      setSpinUpdates(initialSpins);
    } catch (err) { console.error(err); }
  }, [backendApiUrl]);

  const fetchData = useCallback(async () => {
    if (!dispatcher) return;
    setIsLoading(true);
    if (activeTab === 'orders') await fetchOrders();
    if (activeTab === 'users') await fetchUsers();
    setIsLoading(false);
  }, [dispatcher, activeTab, fetchOrders, fetchUsers]);

  useEffect(() => {
    if (!isLoadingProducts && !dispatcher) {
      navigate('/dispatcher-login');
    } else if (dispatcher) {
      fetchData();
      if (allProductsWithStock.length > 0) {
        const initialInputs = {};
        allProductsWithStock.forEach(p => {
            initialInputs[p.id || p.name] = {
                stock: p.stock.toString(),
                price: getNumericPrice(p.price).toString()
            };
        });
        setInventoryInputs(initialInputs);
      }
    }
  }, [dispatcher, navigate, fetchData, isLoadingProducts, allProductsWithStock, getNumericPrice]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${backendApiUrl}/api/dispatcher/users`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        if (!res.ok) throw new Error('Error al crear usuario');
        alert('Usuario creado');
        setShowCreateUserModal(false);
        setNewUser({ name: '', email: '', password: '', phone: '', spins: 0 });
        fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteUser = async (userId) => {
      if (!confirm('¿Eliminar usuario permanentemente?')) return;
      try {
          await fetch(`${backendApiUrl}/api/dispatcher/user/${userId}`, { method: 'DELETE' });
          fetchUsers();
      } catch (err) { console.error(err); }
  };

  const handleUpdateSpins = async (userId) => {
      try {
          await fetch(`${backendApiUrl}/api/dispatcher/user/${userId}`, {
              method: 'PUT', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ spins: spinUpdates[userId] })
          });
          alert('Giros actualizados');
          fetchUsers();
      } catch (err) { console.error(err); }
  };

  const handleViewUserDetails = async (userId) => {
      try {
          const res = await fetch(`${backendApiUrl}/api/dispatcher/user/${userId}/details`);
          if (!res.ok) throw new Error('Usuario no encontrado');
          const data = await res.json();
          setSelectedUser(data);
          setShowUserModal(true);
      } catch (err) { alert(err.message); }
  };

  const handleInventoryChange = (productId, field, value) => {
    setInventoryInputs(prev => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  };

  const handleUpdateProduct = async (productId, inputs, productName) => {
    const newStock = parseInt(inputs.stock, 10);
    const newPrice = parseFloat(inputs.price);
    if (isNaN(newStock) || newStock < 0 || isNaN(newPrice) || newPrice < 0) return alert("Datos inválidos");
    setIsUpdating(productId);
    try {
      await fetch(`${backendApiUrl}/api/dispatcher/product/${productId}/update`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStock, newPrice }),
      });
      alert(`Producto "${productName}" actualizado.`);
      if (refreshProductsStock) refreshProductsStock();
    } catch (err) { alert(err.message); } finally { setIsUpdating(null); }
  };

  const handleMarkAsShipped = async (orderId) => {
    const trackingNumber = prompt("Número de guía (Opcional):");
    try {
      await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/dispatch`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ trackingNumber: trackingNumber || undefined })
      });
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  const handleUnshipOrder = async (orderId) => {
    if (!window.confirm("¿Revertir despacho?")) return;
    try {
        await fetch(`${backendApiUrl}/api/dispatcher/order/${orderId}/unship`, { method: 'PUT', headers: { 'Content-Type': 'application/json', }, });
        fetchOrders();
    } catch (err) { console.error(err); }
  };

  // --- FUNCIÓN RENDER DE TARJETA RESTAURADA Y MEJORADA ---
  const renderOrderCard = (order, isPending) => (
    <div key={order._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col h-full">
      {/* Encabezado: ID y Fecha */}
      <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
         <div>
            <h2 className="text-xl font-bold text-yellow-400">Orden #{order._id.slice(-6)}</h2>
            <p className="text-sm text-gray-400 mt-1">Fecha: {new Date(order.createdAt).toLocaleString()}</p>
         </div>
         <div className="text-right">
             <p className="text-lg font-bold text-white">{formatMXN(order.totalAmount)}</p>
             <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase mt-1 ${order.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>{order.status}</span>
         </div>
      </div>

      <div className="flex-grow space-y-4 text-sm text-gray-300">
         
         {/* Vendedor / Referido */}
         {(order.referredByEmployeeInfo?.name || order.referralCode) && (
             <div className="bg-gray-900/50 p-2 rounded border-l-4 border-green-500">
                 <h4 className="font-bold text-gray-200 text-xs uppercase">Vendido por:</h4>
                 <p className="text-green-400 font-semibold text-base">{order.referredByEmployeeInfo?.name || order.referralCode}</p>
             </div>
         )}

         {/* Cliente */}
         <div>
            <h4 className="font-bold text-gray-200 mb-1 text-xs uppercase">Cliente:</h4>
            <div className="flex items-center gap-2">
                <p className="text-white font-medium text-base">{order.customerDetails.name}</p>
                {order.userId && (
                    <button onClick={() => handleViewUserDetails(order.userId)} className="text-blue-400 hover:text-blue-300" title="Ver perfil usuario">
                        <FaEye />
                    </button>
                )}
            </div>
            <p className="text-gray-400">{order.customerDetails.email}</p>
            <p className="text-gray-400">{order.customerDetails.phone}</p>
         </div>

         {/* Dirección */}
         <div className="bg-black/20 p-3 rounded">
            <h4 className="font-bold text-gray-200 mb-1 text-xs uppercase">Dirección de Envío:</h4>
            <p className="text-gray-300 break-words">{order.customerDetails.address}</p>
            <p className="text-yellow-500 font-medium mt-1">
                {order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.postalCode}
            </p>
            {order.shippingDetails?.trackingNumber && (
                <p className="mt-2 pt-2 border-t border-gray-700 text-blue-300 font-bold">
                    Guía: {order.shippingDetails.trackingNumber}
                </p>
            )}
         </div>

         {/* Productos */}
         <div>
            <h4 className="font-bold text-gray-200 mb-2 text-xs uppercase border-b border-gray-700 pb-1">Productos:</h4>
            <ul className="space-y-2">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-start bg-gray-700/30 p-2 rounded">
                        <div>
                            <span className="font-bold text-white">{item.quantity} x </span>
                            <span className="text-gray-300">{item.name}</span>
                            <span className="block text-xs text-gray-500 italic">{item.presentation}</span>
                        </div>
                    </li>
                ))}
            </ul>
         </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        {isPending ? (
            <button 
                onClick={() => handleMarkAsShipped(order._id)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <FaShippingFast /> Marcar Despachado
            </button>
        ) : (
            <button 
                onClick={() => handleUnshipOrder(order._id)} 
                className="w-full bg-gray-700 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <FaUndo /> Revertir Despacho
            </button>
        )}
      </div>
    </div>
  );

  if (!dispatcher) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
          <button onClick={() => {logoutDispatcher(); navigate('/dispatcher-login');}} className="bg-red-600 px-4 py-2 rounded font-bold text-sm hover:bg-red-700 transition-colors">Salir</button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-700 overflow-x-auto pb-1">
          <button onClick={() => setActiveTab('orders')} className={`py-2 px-6 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'bg-gray-800 text-yellow-400 border-t border-x border-gray-700' : 'text-gray-500 hover:text-white'}`}>Órdenes</button>
          <button onClick={() => setActiveTab('users')} className={`py-2 px-6 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'users' ? 'bg-gray-800 text-yellow-400 border-t border-x border-gray-700' : 'text-gray-500 hover:text-white'}`}>Usuarios</button>
          <button onClick={() => setActiveTab('inventory')} className={`py-2 px-6 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${activeTab === 'inventory' ? 'bg-gray-800 text-yellow-400 border-t border-x border-gray-700' : 'text-gray-500 hover:text-white'}`}>Inventario</button>
        </div>

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div>
                <h2 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">Pendientes <span className="bg-yellow-500/20 text-yellow-400 text-sm px-2 py-1 rounded-full">{pendingOrders.length}</span></h2>
                {pendingOrders.length === 0 && <p className="text-gray-500 italic">No hay órdenes pendientes.</p>}
                <div className="space-y-6">{pendingOrders.map(o => renderOrderCard(o, true))}</div>
             </div>
             <div>
                <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">Despachados <span className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1 rounded-full">{shippedOrders.length}</span></h2>
                {shippedOrders.length === 0 && <p className="text-gray-500 italic">No hay historial reciente.</p>}
                <div className="space-y-6">{shippedOrders.map(o => renderOrderCard(o, false))}</div>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Lista de Usuarios Registrados</h2>
                  <button onClick={() => setShowCreateUserModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold transition-colors shadow-lg"><FaUserPlus/> Nuevo Usuario</button>
              </div>
              <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="bg-gray-900 text-gray-400 uppercase text-xs tracking-wider">
                          <tr>
                              <th className="p-4 font-semibold">Nombre</th>
                              <th className="p-4 font-semibold">Email / Teléfono</th>
                              <th className="p-4 font-semibold text-center">Giros Ruleta</th>
                              <th className="p-4 font-semibold text-right">Acciones</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                          {users.map(u => (
                              <tr key={u._id} className="hover:bg-gray-700/50 transition-colors">
                                  <td className="p-4 font-bold text-white">{u.name}</td>
                                  <td className="p-4">
                                      <div className="flex flex-col">
                                          <span>{u.email}</span>
                                          <span className="text-gray-500 text-xs">{u.phone}</span>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center justify-center gap-2">
                                          <input 
                                            type="number" 
                                            className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-center text-white focus:ring-1 focus:ring-yellow-500 outline-none"
                                            value={spinUpdates[u._id] !== undefined ? spinUpdates[u._id] : u.spins}
                                            onChange={(e) => setSpinUpdates({...spinUpdates, [u._id]: e.target.value})}
                                          />
                                          <button onClick={() => handleUpdateSpins(u._id)} className="text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-blue-400/10 transition-colors" title="Guardar Giros"><FaSave/></button>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex justify-end gap-3">
                                          <button onClick={() => handleViewUserDetails(u._id)} className="text-yellow-400 hover:text-yellow-300 p-2 rounded hover:bg-yellow-400/10 transition-colors" title="Ver Detalles"><FaEye/></button>
                                          <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-400/10 transition-colors" title="Eliminar"><FaTrash/></button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {allProductsWithStock.map(p => {
                 const pid = p.id || p.name;
                 const inputs = inventoryInputs[pid] || { stock: '', price: '' };
                 return (
                     <div key={pid} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg flex flex-col">
                         <div className="h-32 bg-black/20 rounded-lg mb-4 p-2 flex items-center justify-center">
                            <img src={p.modelPath} alt={p.name} className="h-full object-contain"/>
                         </div>
                         <h3 className="font-bold text-yellow-400 mb-1 truncate" title={p.name}>{p.name}</h3>
                         <p className="text-xs text-gray-400 mb-4 truncate">{p.presentation}</p>
                         
                         <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                             <div>
                                 <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Stock</label>
                                 <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-yellow-500 outline-none transition-colors" value={inputs.stock} onChange={(e) => handleInventoryChange(pid, 'stock', e.target.value)} />
                             </div>
                             <div>
                                 <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Precio</label>
                                 <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-yellow-500 outline-none transition-colors" value={inputs.price} onChange={(e) => handleInventoryChange(pid, 'price', e.target.value)} />
                             </div>
                         </div>
                         <button onClick={() => handleUpdateProduct(pid, inputs, p.name)} disabled={isUpdating === pid} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm transition-colors disabled:opacity-50">
                             {isUpdating === pid ? 'Guardando...' : 'Guardar Cambios'}
                         </button>
                     </div>
                 );
             })}
          </div>
        )}

        {/* Modal Create User */}
        {showCreateUserModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Usuario</h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                            <input type="text" className="w-full bg-gray-900 p-2 rounded border border-gray-600 text-white focus:border-yellow-500 outline-none" onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Email</label>
                            <input type="email" className="w-full bg-gray-900 p-2 rounded border border-gray-600 text-white focus:border-yellow-500 outline-none" onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs text-gray-400 mb-1">Contraseña</label>
                                <input type="password" className="w-full bg-gray-900 p-2 rounded border border-gray-600 text-white focus:border-yellow-500 outline-none" onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                             </div>
                             <div>
                                <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                                <input type="tel" className="w-full bg-gray-900 p-2 rounded border border-gray-600 text-white focus:border-yellow-500 outline-none" onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                             </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Giros Iniciales</label>
                            <input type="number" className="w-full bg-gray-900 p-2 rounded border border-gray-600 text-white focus:border-yellow-500 outline-none" onChange={e => setNewUser({...newUser, spins: e.target.value})} defaultValue={0} />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowCreateUserModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded font-bold text-gray-300 transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded font-bold text-white transition-colors">Crear</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal User Details */}
        {showUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-gray-800 p-8 rounded-xl max-w-3xl w-full border border-gray-700 relative max-h-[90vh] overflow-y-auto shadow-2xl">
                    <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><FaTimes size={24}/></button>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-black w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                            {selectedUser.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-bold text-white">{selectedUser.user.name}</h2>
                            <p className="text-gray-400 text-lg">{selectedUser.user.email}</p>
                            <p className="text-gray-500">{selectedUser.user.phone || 'Sin teléfono'}</p>
                        </div>
                        <div className="sm:ml-auto text-center bg-gray-900 p-4 rounded-lg border border-yellow-500/30">
                            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Giros Disponibles</p>
                            <p className="text-4xl font-black text-yellow-400">{selectedUser.user.spins}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2"><span className="text-xl">🏆</span> Historial de Premios</h3>
                            <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto border border-gray-700">
                                {selectedUser.user.prizes && selectedUser.user.prizes.length > 0 ? (
                                    <ul className="space-y-3">
                                        {selectedUser.user.prizes.map((p, i) => (
                                            <li key={i} className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700">
                                                <span className="text-yellow-200 font-medium">{p.name}</span>
                                                <span className="text-gray-500 text-xs bg-black/30 px-2 py-1 rounded">{new Date(p.date).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500 text-center mt-10 italic">Este usuario aún no ha ganado premios.</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2"><span className="text-xl">📦</span> Últimas Órdenes</h3>
                             <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto border border-gray-700">
                                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                                    <ul className="space-y-3">
                                        {selectedUser.orders.map((o, i) => (
                                            <li key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-500 transition-colors">
                                                <div>
                                                    <p className="font-bold text-white">{formatMXN(o.totalAmount)}</p>
                                                    <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${o.status === 'paid' ? 'bg-green-900 text-green-300' : o.status === 'shipped' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>{o.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500 text-center mt-10 italic">Sin historial de órdenes.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DispatcherDashboardPage;