// src/components/RegistroModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { register } from '../services/auth.service.js';
import { User, Lock, Mail, FileText, CalendarDays, Phone, Hospital, X } from 'lucide-react';

const inputBaseStyle = "w-full pl-4 pr-4 py-3 bg-transparent border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";
const inputWithIconStyle = `${inputBaseStyle} pl-10`;
const buttonPrimaryStyle = "w-full py-3 px-6 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50";
const buttonSecondaryStyle = "w-full py-3 px-6 bg-transparent text-gray-700 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors";

export default function RegistroModal({ open, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    nombre_usuario: '',
    password: '',
    id_rol_sistema: 3,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
      setTimeout(onSwitchToLogin, 2000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onDialogClick = (e) => e.stopPropagation();

  // --- LA CORRECCIÓN ESTÁ AQUÍ ---
  return (
    <dialog 
      ref={dialogRef} 
      onCancel={onClose} // Se dispara al presionar 'Esc'
      onClick={onClose}   // Se dispara al hacer click en el fondo (backdrop)
      className="bg-transparent backdrop:bg-black/50 p-0 rounded-lg max-w-4xl"
    >
      <div className="bg-background rounded-lg shadow-xl w-full flex overflow-hidden" onClick={onDialogClick}>
        
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Hospital className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">MediCare Hospital</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Creá tu cuenta</h2>
            <p className="text-gray-600 mt-2">Registrate como paciente para acceder a tus turnos e historial.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-3">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm col-span-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm col-span-2">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                  <input id="nombre" type="text" value={formData.nombre} onChange={handleChange} required className={inputBaseStyle} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido</label>
                  <input id="apellido" type="text" value={formData.apellido} onChange={handleChange} required className={inputBaseStyle} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="dni" className="text-sm font-medium text-gray-700">DNI</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input id="dni" placeholder="Tu número de documento" value={formData.dni} onChange={handleChange} required className={inputWithIconStyle} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input id="email" type="email" placeholder="tu@correo.com" value={formData.email} onChange={handleChange} required className={inputWithIconStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fecha_nacimiento" className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} required className={inputBaseStyle} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input id="telefono" placeholder="Opcional" value={formData.telefono} onChange={handleChange} className={inputWithIconStyle} />
                  </div>
                </div>
              </div>
              
              <hr className="my-3 border-gray-200" />

              <div className="space-y-2">
                <label htmlFor="nombre_usuario" className="text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input id="nombre_usuario" placeholder="Elige tu @usuario" value={formData.nombre_usuario} onChange={handleChange} required className={inputWithIconStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password-register" className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input id="password-register" type="password" placeholder="Crea una contraseña segura" value={formData.password} onChange={handleChange} required className={inputWithIconStyle} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button type="submit" disabled={isLoading || success} className={buttonPrimaryStyle}>
                {isLoading ? 'Creando cuenta...' : (success ? '¡Registrado!' : 'Confirmar y Crear Cuenta')}
              </button>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className={buttonSecondaryStyle}
              >
                ¿Ya tenés cuenta? <span className="font-semibold ml-1 text-primary">Iniciá sesión</span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="hidden md:block md:w-1/2">
          <img
            src="/medical-team-of-doctors-and-nurses.jpg"
            alt="Equipo médico"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </dialog>
  );
}