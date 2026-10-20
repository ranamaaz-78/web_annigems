import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Wraps routes that need a signed-in user; sends guests to /login and back afterwards.
export default function ProtectedRoute() {
  const { isLoggedIn, isB2B } = useAuth();
  const { pathname } = useLocation();
  if (!isLoggedIn) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  // Business accounts have their own area
  if (isB2B) return <Navigate to="/b2b" replace />;
  return <Outlet />;
}
