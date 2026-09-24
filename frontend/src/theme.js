export const C = {
  base: "#141210", panel: "#1C1917", panel2: "#232019", line: "#332E27",
  bone: "#F2EDE4", mute: "#9C9184", clay: "#E4572E", clayDim: "#7A3320", sun: "#E9B44C",
};

export const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];

export const STATUS_COLOR = {
  Applied: "#8AA0B4", OA: "#E9B44C", Interview: "#E4572E", Offer: "#5FB878", Rejected: "#7A6E63",
};

export const input = { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid " + C.line, fontSize: 14, outline: "none", background: C.panel, color: C.bone, boxSizing: "border-box" };
export const bigAction = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "16px 20px", borderRadius: 14, fontSize: 15.5, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em" };
export const ghost = { display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10, border: "1px solid " + C.line, background: "transparent", color: C.bone, fontSize: 14, fontWeight: 600, cursor: "pointer" };
export const icon = { display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, border: "1px solid " + C.line, background: "transparent", color: C.mute, cursor: "pointer" };
export const rowSpan = { display: "inline-flex", alignItems: "center", gap: 8 };

export function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
