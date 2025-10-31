import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
  const location = useLocation();
  const { sub } = useAuth();

  if (sub) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
