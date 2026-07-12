import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const raw =
    localStorage.getItem("transitops.session") ||
    sessionStorage.getItem("transitops.session");

  if (raw) {
    const session = JSON.parse(raw);

    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem("transitops.session");
      sessionStorage.removeItem("transitops.session");

      return (
        <Navigate
          to={ROUTES.LOGIN}
          state={{ expired: true }}
          replace
        />
      );
    }
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}