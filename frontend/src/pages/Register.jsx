import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import { AuthShell } from "./Login.jsx";
import Field from "../components/Field.jsx";
import { C, input, bigAction } from "../theme.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    try {
      await registerUser(name, email, password);
      navigate("/login");   // after registering, go log in
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <AuthShell title="Get started" subtitle="Create an account in under a minute.">
      <Field label="Name"><input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" /></Field>
      <Field label="Email"><input style={input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" /></Field>
      <Field label="Password"><input style={input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" /></Field>
      {error && <p style={{ color: C.clay, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
      <button onClick={handleSubmit} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none", width: "100%", justifyContent: "center", marginTop: 6 }}>Create account</button>
      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: C.mute }}>
        Have an account? <Link to="/login" style={{ color: C.sun, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
