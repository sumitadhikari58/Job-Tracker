import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../api/auth.js";
import { errorMessage } from "../api/client.js";
import Mark from "../components/Mark.jsx";
import Field from "../components/Field.jsx";
import { C, input, bigAction } from "../theme.js";

export default function Login() {
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
      const res = await loginUser(email, password);
      login(res.data.token, res.data.user);   // store the JWT via context
      navigate("/");                           // go to dashboard
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your board." onSubmit={handleSubmit}>
      <Field label="Email"><input style={input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" required autoComplete="email" /></Field>
      <Field label="Password"><input style={input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" required autoComplete="current-password" /></Field>
      {error && <p role="alert" style={{ color: C.clay, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none", width: "100%", justifyContent: "center", marginTop: 6, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Signing in..." : "Sign in"}</button>
      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: C.mute }}>
        New here? <Link to="/register" style={{ color: C.sun, fontWeight: 600, textDecoration: "none" }}>Create one</Link>
      </p>
    </AuthShell>
  );
}

// shared shell so Login and Register look identical
export function AuthShell({ title, subtitle, onSubmit, children }) {
  return (
    <div className="auth-grid" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", background: C.base }}>
      <div className="auth-hero" style={{ background: C.panel, color: C.bone, padding: "56px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", borderRight: "1px solid " + C.line }}>
        <div style={{ position: "absolute", right: -80, bottom: -80, width: 340, height: 340, background: "radial-gradient(circle, " + C.clayDim + "66, transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
          <Mark size={38} />
          <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.03em" }}>jobtrackr</span>
        </div>
        <div style={{ position: "relative" }}>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98, margin: 0 }}>
            The whole<br />season, on<br /><span style={{ color: C.clay }}>one board.</span>
          </h1>
          <p style={{ color: C.mute, marginTop: 22, fontSize: 16.5, lineHeight: 1.6, maxWidth: 400 }}>
            Applied, assessment, interview, offer. Track every application in the placement grind without losing where you stand.
          </p>
        </div>
        <div style={{ display: "flex", gap: 34, position: "relative" }}>
          {[["120+", "tracked"], ["5", "stages"], ["1", "board"]].map(([n, l]) => (
            <div key={l}><div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>{n}</div><div style={{ fontSize: 12, color: C.mute, marginTop: 3 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 350 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>{title}</h2>
          <p style={{ color: C.mute, margin: "7px 0 30px", fontSize: 14.5 }}>{subtitle}</p>
          {children}
        </form>
      </div>
    </div>
  );
}
