import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { credentials } = useAuth();

  if (!credentials) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
