
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, useCurrentToken } from "@/Redux/features/auth/authSlice";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(useCurrentToken);

  if (!user || !token) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
