
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};
