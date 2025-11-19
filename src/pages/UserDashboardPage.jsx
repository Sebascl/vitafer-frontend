import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserDashboardPage = () => {
  const { user, updateUserSpins, token } = useAuth();
  const { formatMXN } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState('');

  const handleSpin = async () => {
    if (isSpinning || user.spins <= 0) return;
    setIsSpinning(true);
    setWinMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/user/spin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setTimeout(() => {
          setWinMessage(`¡Felicidades! Ganaste: ${data.prize}`);
          updateUserSpins(data.remainingSpins, data.prize);
          setIsSpinning(false);
        }, 3000);
      } else {
        setWinMessage(data.message);
        setIsSpinning(false);
      }
    } catch (error) {
      setWinMessage("Error al girar la ruleta");
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-gray-800 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Hola, {user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
          <div className="bg-gray-800 px-6 py-3 rounded-lg text-center border border-yellow-500/30">
             <p className="text-gray-300 text-sm">Giros Disponibles</p>
             <p className="text-3xl font-bold text-yellow-400">{user?.spins || 0}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'profile' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Mis Órdenes</button>
            <button onClick={() => setActiveTab('roulette')} className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'roulette' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Ruleta de Premios 🎰</button>
            <button onClick={() => setActiveTab('prizes')} className={`pb-2 px-4 whitespace-nowrap ${activeTab === 'prizes' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Mis Premios</button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Historial de Compras</h2>
            {user?.orders && user.orders.length > 0 ? (
               user.orders.map(order => (
                 <div key={order._id} className="bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-yellow-500 font-bold">#{order._id.slice(-6)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{order.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="space-y-1 mb-3">
                        {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-300">{item.quantity}x {item.name}</p>
                        ))}
                    </div>
                    <p className="font-bold text-right">{formatMXN(order.totalAmount)}</p>
                 </div>
               ))
            ) : (
                <p className="text-gray-500">Aún no has realizado compras.</p>
            )}
          </div>
        )}

        {activeTab === 'roulette' && (
            <div className="flex flex-col items-center justify-center py-10">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">¡Gira y Gana!</h2>
                <p className="text-gray-400 mb-8 text-center max-w-md">Usa tus giros acumulados por compras para ganar descuentos y premios exclusivos.</p>
                
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8">
                    <div className={`w-full h-full rounded-full border-4 border-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.5)] relative overflow-hidden transition-transform duration-[3000ms] ease-out ${isSpinning ? 'rotate-[1080deg]' : ''}`}
                         style={{ background: 'conic-gradient(#fbbf24 0deg 45deg, #000 45deg 90deg, #fbbf24 90deg 135deg, #000 135deg 180deg, #fbbf24 180deg 225deg, #000 225deg 270deg, #fbbf24 270deg 315deg, #000 315deg 360deg)' }}>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 z-10 filter drop-shadow-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="text-4xl animate-pulse">🎁</span>
                    </div>
                </div>

                {winMessage && (
                    <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-6 py-3 rounded-lg mb-6 font-bold text-lg animate-bounce">
                        {winMessage}
                    </div>
                )}

                <button 
                    onClick={handleSpin} 
                    disabled={isSpinning || user.spins <= 0}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-xl py-3 px-12 rounded-full shadow-lg hover:scale-105 hover:shadow-yellow-500/40 transition-all disabled:opacity-50 disabled:grayscale"
                >
                    {isSpinning ? 'Girando...' : `GIRAR (${user.spins})`}
                </button>
            </div>
        )}

        {activeTab === 'prizes' && (
            <div className="space-y-4">
                 <h2 className="text-2xl font-semibold mb-4">Mis Premios Ganados</h2>
                 {user?.prizes && user.prizes.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {user.prizes.map((prize, idx) => (
                             <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg border border-yellow-500/20 flex items-center gap-4">
                                 <div className="bg-yellow-500/20 p-3 rounded-full text-2xl">🏆</div>
                                 <div>
                                     <p className="font-bold text-yellow-300">{prize.name}</p>
                                     <p className="text-xs text-gray-500">{new Date(prize.date).toLocaleDateString()}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <p className="text-gray-500">Aún no has ganado premios. ¡Haz una compra para girar la ruleta!</p>
                 )}
            </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboardPage;