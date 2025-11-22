import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearchParams } from 'react-router-dom';

const UserDashboardPage = () => {
  const { user, updateUserSpins, token } = useAuth();
  const { formatMXN } = useCart();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); 
  const [transitionDuration, setTransitionDuration] = useState('0s'); 
  const [winMessage, setWinMessage] = useState('');
  const [prizeHistory, setPrizeHistory] = useState(user?.prizes || []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'roulette') {
        setActiveTab('roulette');
    }
  }, [searchParams]);

  const segments = [
    { index: 0, type: 'prize', content: '3 Sachets', label: '3 Sachets Vitafer', imgCount: 3, color: '#ca8a04' }, 
    { index: 1, type: 'prize', content: '1 Sachet',  label: '1 Sachet Vitafer',  imgCount: 1, color: '#eab308' }, 
    { index: 2, type: 'prize', content: '2 Sachets', label: '2 Sachets Vitafer', imgCount: 2, color: '#ca8a04' },
    { index: 3, type: 'empty', content: 'Vacia',     label: 'Casilla Vacia',     imgCount: 0, color: '#1f2937' }, 
    { index: 4, type: 'prize', content: '1 Sachet',  label: '1 Sachet Vitafer',  imgCount: 1, color: '#eab308' },
    { index: 5, type: 'prize', content: '2 Sachets', label: '2 Sachets Vitafer', imgCount: 2, color: '#ca8a04' },
    { index: 6, type: 'prize', content: '1 Sachet',  label: '1 Sachet Vitafer',  imgCount: 1, color: '#eab308' },
    { index: 7, type: 'empty', content: 'Vacia',     label: 'Casilla Vacia',     imgCount: 0, color: '#1f2937' },
  ];

  const wheelGradient = `conic-gradient(
    ${segments.map((seg, i) => `${seg.color} ${i * 12.5}% ${(i + 1) * 12.5}%`).join(', ')}
  )`;

  const handleSpin = async () => {
    if (isSpinning || user.spins <= 0) return;
    
    setWinMessage('');
    setTransitionDuration('0s'); 
    setRotation(0); 
    setIsSpinning(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/user/spin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok) {
          setWinMessage(data.message || "Error al girar");
          setIsSpinning(false);
          return;
      }

      setTimeout(() => {
          const targetIndices = segments
            .filter(seg => seg.label === data.prize)
            .map(seg => seg.index);

          const targetIndex = targetIndices.length > 0 
            ? targetIndices[Math.floor(Math.random() * targetIndices.length)] 
            : 3; 

          const segmentAngle = 45; 
          const centerOffset = 22.5; 
          const randomOffset = Math.floor(Math.random() * 14) - 7; 
          const spinLoops = 5 * 360; 

          const finalDegree = spinLoops + (360 - (targetIndex * segmentAngle) - centerOffset) + randomOffset;

          setTransitionDuration('4000ms'); 
          setRotation(finalDegree);

          setTimeout(() => {
            if(data.isWin) {
                setWinMessage(`🎉 ¡GANASTE! ${data.prize}. Se enviará en tu próximo pedido.`);
                setPrizeHistory(prev => [...prev, { name: data.prize, date: new Date(), status: 'pending' }]);
            } else {
                setWinMessage(`😢 ${data.prize}. ¡Suerte para la próxima!`);
            }
            updateUserSpins(data.remainingSpins); 
            setIsSpinning(false);
          }, 4000);
          
      }, 50); 

    } catch (error) {
      console.error(error);
      setWinMessage("Error de conexión");
      setIsSpinning(false);
    }
  };

  // Cálculo para la barra de progreso
  const nextSpinAmount = 500;
  const currentProgress = user?.progressAmount || 0;
  const progressPercentage = Math.min((currentProgress / nextSpinAmount) * 100, 100);
  const remaining = nextSpinAmount - currentProgress;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-gray-800 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Hola, {user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
          <div className="bg-gray-800 px-6 py-3 rounded-lg text-center border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] w-full md:w-auto">
             <p className="text-gray-300 text-sm uppercase tracking-wider">Giros Disponibles</p>
             <p className="text-4xl font-black text-yellow-400">{user?.spins || 0}</p>
             
             <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
             </div>
             <p className="text-[10px] text-gray-400 mt-1">Te faltan ${remaining} para el próximo giro</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`pb-2 px-4 whitespace-nowrap font-bold ${activeTab === 'profile' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-white'}`}>Mis Órdenes</button>
            <button onClick={() => setActiveTab('roulette')} className={`pb-2 px-4 whitespace-nowrap font-bold ${activeTab === 'roulette' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-white'}`}>Ruleta de Premios 🎰</button>
            <button onClick={() => setActiveTab('prizes')} className={`pb-2 px-4 whitespace-nowrap font-bold ${activeTab === 'prizes' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-white'}`}>Mis Premios</button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-white">Historial de Compras</h2>
            {user?.orders && user.orders.length > 0 ? (
               user.orders.map(order => (
                 <div key={order._id} className="bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-yellow-500 font-bold">#{order._id.slice(-6)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{order.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="space-y-1 mb-3 border-t border-gray-800 pt-2">
                        {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-300">{item.quantity}x {item.name}</p>
                        ))}
                    </div>
                    <p className="font-bold text-right text-lg">{formatMXN(order.totalAmount)}</p>
                 </div>
               ))
            ) : (
                <p className="text-gray-500 italic">Aún no has realizado compras.</p>
            )}
          </div>
        )}

        {activeTab === 'roulette' && (
            <div className="flex flex-col items-center justify-center py-10">
                <h2 className="text-3xl font-black text-yellow-400 mb-2 uppercase tracking-wide text-center">¡Gira y Gana Vitafer!</h2>
                <p className="text-gray-400 mb-10 text-center max-w-md">Prueba tu suerte para ganar sachets adicionales en tu próximo envío.</p>
                
                <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] mb-10 overflow-visible">
                    
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 filter drop-shadow-xl">
                         <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-red-600"></div>
                    </div>

                    <div 
                         className="w-full h-full rounded-full border-[12px] border-gray-900 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden"
                         style={{ 
                             transform: `rotate(${rotation}deg)`,
                             transition: `transform ${transitionDuration} cubic-bezier(0.25, 0.1, 0.25, 1)`,
                             background: wheelGradient
                         }}
                    >
                         
                         {segments.map((segment) => {
                             const rotationAngle = segment.index * 45 + 22.5; 
                             return (
                                 <div 
                                    key={segment.index}
                                    className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none flex justify-center"
                                    style={{ 
                                        transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`
                                    }}
                                 >
                                     <div className="absolute top-0 pt-4 flex flex-col items-center h-1/2 justify-start" style={{ transform: 'translateY(10px)' }}>
                                         {segment.type === 'prize' ? (
                                             <>
                                                <div className="flex gap-1 mb-1 justify-center">
                                                    {[...Array(segment.imgCount)].map((_, i) => (
                                                        <img 
                                                            key={i} 
                                                            src="/images/sachet-individual.png" 
                                                            alt="Sachet" 
                                                            className="w-6 h-8 sm:w-9 sm:h-12 object-contain drop-shadow-md"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-black font-bold text-[10px] sm:text-xs uppercase tracking-tighter bg-white/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                                    {segment.content}
                                                </span>
                                             </>
                                         ) : (
                                             <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mt-8 opacity-50">
                                                 Vacía
                                             </span>
                                         )}
                                     </div>
                                 </div>
                             );
                         })}

                         <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                            <div className="w-6 h-6 bg-white rounded-full shadow-lg z-10 border-4 border-gray-300"></div>
                         </div>
                    </div>
                </div>

                {winMessage && (
                    <div className={`px-8 py-4 rounded-xl mb-8 font-bold text-xl text-center shadow-2xl animate-bounce max-w-md border-2 ${winMessage.includes('GANASTE') ? 'bg-yellow-500 text-black border-white' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                        {winMessage}
                    </div>
                )}

                <button 
                    onClick={handleSpin} 
                    disabled={isSpinning || user.spins <= 0}
                    className="bg-gradient-to-b from-yellow-400 to-orange-600 text-black font-black text-2xl py-4 px-16 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:scale-105 hover:shadow-yellow-500/80 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed border-4 border-yellow-300"
                >
                    {isSpinning ? 'GIRANDO...' : `GIRAR AHORA (${user.spins})`}
                </button>
            </div>
        )}

        {activeTab === 'prizes' && (
            <div className="space-y-4">
                 <h2 className="text-2xl font-semibold mb-4 text-white">Mis Premios Ganados</h2>
                 <p className="text-gray-400 text-sm mb-4">Estos productos se añadirán a tu próximo envío.</p>
                 {prizeHistory && prizeHistory.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {prizeHistory.map((prize, idx) => (
                             <div key={idx} className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-xl border border-yellow-500/30 flex items-center gap-4 shadow-md">
                                 <div className="bg-yellow-500/20 p-3 rounded-full text-2xl text-yellow-400">🎁</div>
                                 <div>
                                     <p className="font-bold text-yellow-200 text-lg">{prize.name}</p>
                                     <p className="text-xs text-gray-500 mt-1">{new Date(prize.date).toLocaleDateString()}</p>
                                     <span className={`inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${prize.status === 'shipped' ? 'bg-blue-900/50 text-blue-400 border-blue-900' : 'bg-green-900/50 text-green-400 border-green-900'}`}>
                                         {prize.status === 'shipped' ? 'Enviado' : 'Pendiente de envío'}
                                     </span>
                                 </div>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 text-center">
                        <p className="text-gray-500 text-lg">Aún no has ganado premios.</p>
                        <button onClick={() => setActiveTab('roulette')} className="mt-4 text-yellow-500 hover:underline">¡Ve a la ruleta!</button>
                     </div>
                 )}
            </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboardPage;