import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const BlackFridayModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('seenBlackFriday');
    if (!hasSeen) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('seenBlackFriday', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-gray-900 rounded-2xl border-2 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.4)] overflow-hidden transform transition-all scale-100">
        
        <button 
            onClick={handleClose} 
            className="absolute top-3 right-3 bg-black/50 text-white hover:text-red-400 p-2 rounded-full z-10 transition-colors"
        >
            <FaTimes size={20}/>
        </button>

        <div className="relative h-48 bg-gradient-to-b from-yellow-500 to-yellow-700 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/ruleta-bg.jpg')] bg-cover opacity-20"></div>
            <h1 className="text-5xl font-black text-black tracking-tighter text-center uppercase drop-shadow-md z-10">
                ¡BLACK<br/>FRIDAY!
            </h1>
            <div className="absolute -bottom-10 -right-10 text-9xl opacity-30 rotate-12">🎰</div>
        </div>

        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">¡La Ruleta de la Suerte llegó!</h2>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                ¡Solo por registrarte recibe <strong className="text-yellow-400 text-lg">1 GIRO GRATIS</strong> de bienvenida! 
                <br/>
                Además, por cada <strong className="text-white">$500</strong> en compras obtienes más oportunidades para ganar.
            </p>

            <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Probabilidades de Ganar</h3>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">1 Sachet</span>
                    <span className="text-green-400 font-bold">60%</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">2 Sachets</span>
                    <span className="text-yellow-400 font-bold">20%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white">3 Sachets</span>
                    <span className="text-orange-500 font-bold">10%</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Link 
                    to="/registro" 
                    onClick={handleClose}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors shadow-lg uppercase tracking-wide text-sm flex items-center justify-center"
                >
                    Registrarme y Girar
                </Link>
                <button 
                    onClick={handleClose}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors text-sm uppercase tracking-wide"
                >
                    Ver Tienda
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayModal;