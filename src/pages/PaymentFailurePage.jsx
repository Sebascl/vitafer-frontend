import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-4">Pago Fallido</h1>
        <p className="text-gray-300 text-lg mb-2">Lo sentimos, no pudimos procesar tu pago.</p>
        {orderId && <p className="text-gray-400 text-sm">Tu número de referencia de orden es: <strong className="text-yellow-400">{orderId}</strong></p>}
        {paymentId && <p className="text-gray-400 text-sm">ID de Pago (MercadoPago): <strong className="text-yellow-400">{paymentId}</strong></p>}
        {status && <p className="text-gray-400 text-sm">Estado (MercadoPago): <strong className="text-yellow-400">{status}</strong></p>}
        <p className="text-gray-300 mt-6 mb-8">Por favor, intenta con otro método de pago o contacta a soporte si el problema persiste.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/#contact" // Asumiendo que tienes una sección de contacto
              className="inline-block bg-gray-600 text-white px-8 py-3 rounded-full hover:bg-gray-500 transition-all duration-300 font-semibold text-lg"
            >
              Contactar a Soporte
            </Link>
            <Link
              to="/" // O a la página del carrito para reintentar
              className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 font-semibold text-lg"
            >
              Volver a Intentar / Tienda
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;