import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    return <Navigate to="/error-page" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
