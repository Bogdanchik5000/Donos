import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { IUserCredentials } from "../interfaces/user-interfaces";
import { login, register, logout, loginGoogle } from "../helpers/user-manage";

interface IAuthContextProvider {
  user: User | null;
  login: ({ email, password }: IUserCredentials) => Promise<void>;
  loginGoogle: () => Promise<void>;
  register: ({ email, password }: IUserCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContextProvider);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [waitAuth, setWaitAuth] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setWaitAuth(true);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (waitAuth) {
    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          loginGoogle,
          register,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}
