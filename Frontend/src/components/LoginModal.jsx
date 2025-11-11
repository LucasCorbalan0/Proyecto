// src/components/LoginModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { login } from '../services/auth.service.js';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Building2, X } from 'lucide-react';

const buttonPrimaryStyle = "w-full py-3 px-6 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50";
const buttonSecondaryStyle = "w-full py-3 px-6 bg-transparent text-gray-700 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors";

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(nombre_usuario, password);
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      authLogin(usuario);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const onDialogClick = (e) => e.stopPropagation();

  // --- LA CORRECCIÓN ESTÁ AQUÍ ---
  // 1. Usamos onCancel para la tecla "Esc"
  // 2. Usamos onClick en el <dialog> (el fondo) para cerrar
  // 3. Ya NO usamos la prop "onClose" en el <dialog>
  return (
    <dialog 
      ref={dialogRef} 
      onCancel={onClose} // Se dispara al presionar 'Esc'
      onClick={onClose}   // Se dispara al hacer click en el fondo (backdrop)
      className="bg-transparent backdrop:bg-black/50 p-0 rounded-lg max-w-3xl"
    >
      <div className="bg-background rounded-lg shadow-xl w-full flex overflow-hidden" onClick={onDialogClick}>
        
        <div className="hidden md:block md:w-1/2">
          <img
            src="/modern-hospital-lobby-with-natural-light.jpg" 
            alt="Lobby del hospital"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center relative">
          {/* 3. El botón 'X' también debe llamar a onClose */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MediCare Hospital</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="text-gray-600 mt-2">Accedé a tu panel de gestión.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="username-login" className="text-sm font-medium text-gray-700">Usuario</label>
                <div className="relative">
                  <input
                    id="username-login"
                    type="text"
                    value={nombre_usuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu nombre de usuario"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password-login" className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tu contraseña"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button type="submit" disabled={isLoading} className={buttonPrimaryStyle}>
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className={buttonSecondaryStyle}
              >
                ¿No tenés cuenta? <span className="font-semibold ml-1 text-blue-600">Registrate</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}