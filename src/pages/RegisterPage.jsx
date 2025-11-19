import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', phone: '', 
    address: '', city: '', state: '', postalCode: '' 
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      
      const origin = location.state?.from || '/mi-perfil';
      const shouldOpenCart = location.state?.openCart || false;

      // CAMBIO: Pasamos el estado openCart de nuevo
      navigate(origin, { replace: true, state: { openCart: shouldOpenCart } });

    } catch (err) {
      setError(err.message || 'Error al registrarse');
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-black/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600 text-sm";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden pt-24 pb-10 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-yellow-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Crear Cuenta</h2>
          <p className="text-gray-400 text-sm">Completa tus datos de envío para agilizar tus compras y gana 1 Giro.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
                <h3 className="text-yellow-500 font-bold text-sm border-b border-white/10 pb-2">Datos Personales</h3>
                <div>
                    <label className={labelClass}>Nombre Completo</label>
                    <input type="text" name="name" className={inputClass} onChange={handleChange} required />
                </div>
                <div>
                    <label className={labelClass}>Correo Electrónico</label>
                    <input type="email" name="email" className={inputClass} onChange={handleChange} required />
                </div>
                <div>
                    <label className={labelClass}>Contraseña</label>
                    <input type="password" name="password" className={inputClass} onChange={handleChange} required />
                </div>
                 <div>
                    <label className={labelClass}>Teléfono</label>
                    <input type="tel" name="phone" className={inputClass} onChange={handleChange} required />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-yellow-500 font-bold text-sm border-b border-white/10 pb-2">Dirección de Envío</h3>
                <div>
                    <label className={labelClass}>Dirección y Número</label>
                    <input type="text" name="address" className={inputClass} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Ciudad</label>
                        <input type="text" name="city" className={inputClass} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className={labelClass}>Estado/Depto</label>
                        <input type="text" name="state" className={inputClass} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Código Postal</label>
                    <input type="text" name="postalCode" className={inputClass} onChange={handleChange} required />
                </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-4 rounded-lg shadow-lg shadow-yellow-500/20 transform transition-all active:scale-95 text-lg tracking-wide">
            REGISTRARME Y GANAR GIRO
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" state={{ from: location.state?.from, openCart: location.state?.openCart }} className="text-yellow-400 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;