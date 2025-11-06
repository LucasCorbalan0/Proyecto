// Este hook permite acceder fácilmente al contexto de autenticación.
// En lugar de importar y usar useContext(AuthContext) en cada componente,
// simplemente usamos useAuth().

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Función personalizada (hook) para acceder al contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);

  // Si el hook se usa fuera del AuthProvider, lanza un error
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  // Devuelve los valores del contexto (usuario, login, logout, etc.)
  return context;
}
