import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentPendingPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2M12 12H9m3 3v3m0-9V7.5M7.5 12H6M16.5 12H18m-3.379-3.379l1.28-1.28M15.232 8.768L14 10M8.768 15.232L10 14m5.232 1.232l1.28 1.28M3 10h.01M3.01 14h.01M10 21h.01M14 21h.01M21 10h-.01M21 14h-.01" />
        </svg>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">Pago Pendiente</h1>
        <p className="text-gray-300 text-lg mb-2">Tu pago está siendo procesado o está pendiente de alguna acción.</p>
        {orderId && <p className="text-gray-400 text-sm">Tu número de referencia de orden es: <strong className="text-yellow-400">{orderId}</strong></p>}
        {paymentId && <p className="text-gray-400 text-sm">ID de Pago (MercadoPago): <strong className="text-yellow-400">{paymentId}</strong></p>}
        {status && <p className="text-gray-400 text-sm">Estado (MercadoPago): <strong className="text-yellow-400">{status}</strong></p>}
        <p className="text-gray-300 mt-6 mb-8">Te notificaremos cuando el estado de tu pago cambie. Usualmente esto sucede si pagaste por un medio offline (ej. Efecty, OXXO).</p>
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

export default PaymentPendingPage;