import { ReactNode, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);

  if (user) {
    return children;
  } else {
    return <Navigate to={"/auth"} />;
  }
}
