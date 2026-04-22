import { AuthProvider, AuthContext } from "./AuthContext";
import { use, useContext } from "react";


  const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
export default useAuth;