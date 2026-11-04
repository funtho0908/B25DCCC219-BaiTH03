import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import { readStorage, writeStorage, removeStorage } from "../utils/storage";
const AuthContext = createContext<
  | {
      user: User | null;
      login: (username: string, password: string) => boolean;
      logout: () => void;
    }
  | undefined
>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = readStorage("shopmini-user");
    return saved &&
      typeof saved === "object" &&
      "username" in saved &&
      typeof saved.username === "string" &&
      saved.username.trim()
      ? { username: saved.username }
      : null;
  });
  const login = (username: string, password: string) => {
    if (!username.trim() || password !== "123456") return false;
    const next = { username: username.trim() };
    setUser(next);
    writeStorage("shopmini-user", next);
    return true;
  };
  const logout = () => {
    setUser(null);
    removeStorage("shopmini-user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is required");
  return context;
}
