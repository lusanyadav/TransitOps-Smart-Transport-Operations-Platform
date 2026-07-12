import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps a page element and enforces RBAC for its module.
 * - 'none'  -> silently redirect to the role's own landing page.
 * - 'view'  -> render the page (pages read useAuth().hasAccess themselves to go read-only).
 * - 'full'  -> render the page normally.
 */
export default function ModuleGuard({ module, children }) {
  const { user, hasAccess, landingFor } = useAuth();
  const access = hasAccess(module);

  if (access === 'none') {
    return <Navigate to={landingFor(user.role)} replace />;
  }

  return children;
}
