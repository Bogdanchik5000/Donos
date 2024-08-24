import { ReactNode } from "react";
import { useAppSelector } from "../hooks/hooks.redux.";
import Loading from "../components/Loading/Loading";

export default function AuthLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isLoading = useAppSelector((state) => state.authSlice.isLoading);

  if (isLoading) {
    return <Loading />;
  } else {
    return children;
  }
}
