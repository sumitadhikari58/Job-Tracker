import { C } from "../theme.js";

export default function Mark({ size = 34 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: C.clay, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M6 18L14 6M10 18h8M14 6h-4" stroke={C.bone} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
