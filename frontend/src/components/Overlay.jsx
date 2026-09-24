import { C } from "../theme.js";

export default function Overlay({ children, onClose, width = 520 }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.68)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.base, border: "1px solid " + C.line, borderRadius: 20, padding: 28, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", color: C.bone }}>
        {children}
      </div>
    </div>
  );
}
