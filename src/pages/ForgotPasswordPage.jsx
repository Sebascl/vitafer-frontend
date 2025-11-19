import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const res = await fetch(`${backendApiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMessage('Código enviado. Revisa tu correo.');
      // Redirigir después de 2 segundos a la página de reset
      setTimeout(() => {
          navigate(`/reset-password?email=${email}`);
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Recuperar Contraseña</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">Ingresa tu correo y te enviaremos un código.</p>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo Electrónico"
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition-colors">
            Enviar Código
          </button>
        </form>
        <div className="mt-4 text-center">
            <Link to="/login" className="text-gray-500 text-sm hover:text-white">Volver al Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;