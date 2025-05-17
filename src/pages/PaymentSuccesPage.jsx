import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  const { clearCart } = useCart(); 
  useEffect(() => {
    if (orderId) { 
        clearCart(); 
        console.log("Pago exitoso, carrito debería limpiarse para orden:", orderId);
    }
  }, [orderId, clearCart]); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-300 text-lg mb-2">Gracias por tu compra.</p>
        {orderId && <p className="text-gray-400 text-sm">Tu número de referencia de orden es: <strong className="text-yellow-400">{orderId}</strong></p>}
        {paymentId && <p className="text-gray-400 text-sm">ID de Pago (MercadoPago): <strong className="text-yellow-400">{paymentId}</strong></p>}
        {status && <p className="text-gray-400 text-sm">Estado (MercadoPago): <strong className="text-yellow-400">{status}</strong></p>}
         {externalReference && <p className="text-gray-400 text-sm">Referencia Externa (MercadoPago): <strong className="text-yellow-400">{externalReference}</strong></p>}
        <p className="text-gray-300 mt-6 mb-8">Recibirás una confirmación por Whatsapp cuando tu envío se haya realizado.</p>
        <Link
          to="/"
          className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 font-semibold text-lg"
        >
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;