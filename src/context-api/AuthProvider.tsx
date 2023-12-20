import React, { PropsWithChildren, useState } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  studentCode: string;
  avatar?: string;
  uid: string;
  createAt?: Date;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | null>(() => {
    const localStorageUserSaved = window.localStorage.getItem("user");
    return localStorageUserSaved ? JSON.parse(localStorageUserSaved) : null;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
