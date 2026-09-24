import { createContext, useContext, useState, useEffect } from "react";

// Context lets any component read/change auth state
// without passing props down through every level.
const AuthContext = createContext();

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // token is our source of truth for "is the user logged in".
  // we initialise from localStorage so a refresh keeps you signed in.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readUser);

  // whenever token/user change, keep localStorage in sync.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (newToken, newUser = null) => {
    setToken(newToken);
    setUser(newUser);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// small helper so components can do: const { ... } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
