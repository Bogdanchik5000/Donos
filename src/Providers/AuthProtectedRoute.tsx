import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks.redux.";

export default function AuthProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAppSelector((state) => state.authSlice.user);

  if (user) {
    return children;
  } else {
    return <Navigate to={"/auth"} />;
  }
}
