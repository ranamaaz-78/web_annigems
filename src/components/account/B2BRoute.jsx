import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Wraps business-only routes; everyone else is sent to the business login.
export default function B2BRoute() {
  const { isB2B } = useAuth();
  const { pathname } = useLocation();
  if (!isB2B) return <Navigate to={`/b2b/login?next=${encodeURIComponent(pathname)}`} replace />;
  return <Outlet />;
}
