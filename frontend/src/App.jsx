import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// wrapper that blocks access to a page if the user isn't logged in.
// no token -> bounce to /login.
function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <Routes>
      {/* if already logged in, skip login/register */}
      <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthed ? <Navigate to="/" replace /> : <Register />} />

      {/* dashboard is protected */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* anything else -> home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
