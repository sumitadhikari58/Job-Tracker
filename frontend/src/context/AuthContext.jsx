import { createContext, useContext, useState, useEffect } from "react";

// Context lets any component read/change auth state
// without passing props down through every level.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // token is our source of truth for "is the user logged in".
  // we initialise from localStorage so a refresh keeps you signed in.
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // whenever token changes, keep localStorage in sync.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// small helper so components can do: const { ... } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
