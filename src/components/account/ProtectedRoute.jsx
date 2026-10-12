import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Wraps routes that need a signed-in user; sends guests to /login and back afterwards.
export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  if (!isLoggedIn) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  return <Outlet />;
}
