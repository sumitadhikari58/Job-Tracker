import { C } from "../theme.js";

export default function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.mute, marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}
