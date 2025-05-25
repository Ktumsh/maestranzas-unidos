"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import type { User } from "@/db/schema";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  initialUserData: User | null;
  children: ReactNode;
}

export const UserProvider = ({
  initialUserData,
  children,
}: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUserData);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
