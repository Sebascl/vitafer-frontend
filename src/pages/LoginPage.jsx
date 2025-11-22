import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      
      const origin = location.state?.from || '/mi-perfil';
      const shouldOpenCart = location.state?.openCart || false;

      navigate(origin, { replace: true, state: { openCart: shouldOpenCart } });
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden pt-20 pb-10 px-4">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-yellow-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-white mb-1">Bienvenido</h2>
          <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600"
              placeholder="ejemplo@correo.com"
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 bg-black/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600"
              placeholder="••••••••"
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="text-right">
            <Link to="/recuperar-password" class="text-xs text-yellow-500 hover:text-yellow-400">
                ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/20 transform transition-all active:scale-95">
            INGRESAR Y CONTINUAR
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" state={{ from: location.state?.from, openCart: location.state?.openCart }} className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;