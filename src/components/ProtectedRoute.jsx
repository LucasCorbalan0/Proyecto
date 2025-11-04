import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // o un componente de loading
  }

  // Si no hay usuario, redirigir al inicio
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene el rol adecuado
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}