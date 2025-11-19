import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: '', token: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
      const emailParam = searchParams.get('email');
      if(emailParam) setFormData(prev => ({...prev, email: emailParam}));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendApiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Contraseña restablecida con éxito.');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Nueva Contraseña</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo (Confirmar)"
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Código recibido (6 dígitos)"
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
            value={formData.token}
            onChange={(e) => setFormData({...formData, token: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Nueva Contraseña"
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            required
          />
          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition-colors">
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;