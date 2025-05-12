import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';

const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (mercadoPagoPublicKey) {
  initMercadoPago(mercadoPagoPublicKey, { locale: 'es-MX' });
} else {
  console.warn("Advertencia: La Public Key de MercadoPago no está configurada en las variables de entorno.");
}

// Añade 'onCancel' a las props que recibe el componente
const CheckoutForm = ({ cartItems, cartTotal, formatPrice, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preferenceId, setPreferenceId] = useState(null);

  const { getNumericPrice } = useCart();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preferenceId) return;

    setIsLoading(true);
    setError('');
    setPreferenceId(null);

    const orderData = {
      customerDetails: formData,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: getNumericPrice(item.pricingTiers || item.price, item.quantity),
        presentation: item.presentation,
      })),
      totalAmount: cartTotal,
    };

    if (!backendApiUrl) {
        setError("La URL del API backend no está configurada.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/api/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al procesar la respuesta del servidor.' }));
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }
      const result = await response.json();
      if (result.preferenceId) {
        setPreferenceId(result.preferenceId);
      } else {
        throw new Error('No se recibió el ID de preferencia del servidor.');
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setPreferenceId(null); // Resetea el preferenceId por si acaso
    if (onCancel) {
        onCancel(); // Llama a la función pasada desde ShoppingCart
    }
  };

  if (preferenceId) {
    return (
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-yellow-300 mb-4">¡Listo! Haz clic para pagar</h3>
        <p className="text-gray-300 mb-4">Serás redirigido a MercadoPago para completar tu compra de forma segura.</p>
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
           <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
        </div>
         {/* Llama a handleCancelClick al hacer clic */}
         <button onClick={handleCancelClick} className="text-gray-400 hover:text-white mt-4 text-sm">Cancelar y volver al formulario</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 text-left">
     <h3 className="text-xl font-semibold text-center mb-4 text-yellow-300">Completa tus Datos para Pagar</h3>
     <div>
       <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre Completo</label>
       <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
     </div>
     <div>
       <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
       <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
     </div>
     <div>
       <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Teléfono</label>
       <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
     </div>
     <div>
       <label htmlFor="address" className="block text-sm font-medium text-gray-300">Dirección de Envío</label>
       <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
     </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div>
         <label htmlFor="city" className="block text-sm font-medium text-gray-300">Ciudad</label>
         <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
       </div>
       <div>
         <label htmlFor="state" className="block text-sm font-medium text-gray-300">Departamento/Estado</label>
         <input type="text" name="state" id="state" required value={formData.state} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
       </div>
       <div>
         <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300">Código Postal</label>
         <input type="text" name="postalCode" id="postalCode" required value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
       </div>
     </div>

     {error && <p className="text-red-500 text-sm text-center">{error}</p>}

     <div className="text-center pt-4">
       <button
         type="submit"
         disabled={isLoading}
         className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
       >
         {isLoading ? 'Generando link de pago...' : 'Continuar al Pago'}
       </button>
     </div>
    </form>
  );
};

export default CheckoutForm;