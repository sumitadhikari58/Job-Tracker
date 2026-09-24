import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import { errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthShell } from "./Login.jsx";
import Field from "../components/Field.jsx";
import { C, input, bigAction } from "../theme.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // backend returns a token on register, so sign the user straight in
      const res = await registerUser(name, email, password);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(errorMessage(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Get started" subtitle="Create an account in under a minute." onSubmit={handleSubmit}>
      <Field label="Name"><input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required maxLength={30} autoComplete="name" /></Field>
      <Field label="Email"><input style={input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" required autoComplete="email" /></Field>
      <Field label="Password"><input style={input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 6 characters" required minLength={6} autoComplete="new-password" /></Field>
      {error && <p role="alert" style={{ color: C.clay, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none", width: "100%", justifyContent: "center", marginTop: 6, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Creating account..." : "Create account"}</button>
      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: C.mute }}>
        Have an account? <Link to="/login" style={{ color: C.sun, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
