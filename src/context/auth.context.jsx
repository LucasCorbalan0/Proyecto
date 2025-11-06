// Este componente maneja toda la autenticación de la app.
// Se encarga de guardar el usuario logueado, verificar su sesión,
// y redirigirlo al panel que le corresponde según su rol.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  // Estado global del usuario y del proceso de carga
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cierra sesión, borra datos del usuario y redirige al inicio
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  // Al cargar la app, verifica si hay sesión guardada en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Si hay datos, los carga al estado
      setUser(JSON.parse(storedUser));
    } else {
      // Si no hay sesión, limpia cualquier resto
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  // Inicia sesión, guarda los datos y redirige según el rol
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirige al panel correspondiente según el rol del usuario
    switch (userData.rol) {
      case ROLES.SUPERADMIN:
        navigate('/dashboard/superadmin');
        break;
      case ROLES.ADMIN:
        navigate('/dashboard/admin');
        break;
      case ROLES.RECEPCIONISTA:
        navigate('/dashboard/recepcionista');
        break;
      case ROLES.MEDICO:
        navigate('/dashboard/medico');
        break;
      case ROLES.ENFERMERO:
        navigate('/dashboard/enfermero');
        break;
      case ROLES.PACIENTE:
        navigate('/dashboard/paciente');
        break;
      default:
        navigate('/');
    }
  }, [navigate]);

  // Provee los datos y funciones a toda la aplicación
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Nota: el hook useAuth (que usa este contexto) está en un archivo separado llamado useAuth.js
