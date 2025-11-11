import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - User:', user, 'Loading:', loading, 'AllowedRoles:', allowedRoles);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // TODO: Descomentar esto cuando tengamos login funcional
  // // Si no hay usuario, redirigir al inicio
  // if (!user) {
  //   console.log('ProtectedRoute - No user, redirecting to home');
  //   return <Navigate to="/" replace />;
  // }

  // // Si se especifican roles permitidos y el usuario no tiene el rol adecuado
  // if (allowedRoles && !allowedRoles.includes(user.rol)) {
  //   console.log('ProtectedRoute - User role not allowed. User role:', user.rol, 'Allowed roles:', allowedRoles);
  //   return <Navigate to="/" replace />;
  // }

  return children;
}