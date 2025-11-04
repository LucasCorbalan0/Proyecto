import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    // Verificar si hay un usuario y token almacenado en localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Si falta alguno, hacer logout para limpiar todo
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirigir según el rol
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook moved to a separate file: useAuth.js