import { Navigate } from "react-router-dom";

// Registration is now part of /auth (Usuario tab → "Crear cuenta").
export default function Registro() {
  return <Navigate to="/auth" replace />;
}
