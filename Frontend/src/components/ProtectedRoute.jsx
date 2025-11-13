import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - User:', user, 'Loading:', loading, 'AllowedRoles:', allowedRoles);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Verificar que el usuario tenga un rol permitido
  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}