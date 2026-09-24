import { X } from "lucide-react";
import Overlay from "./Overlay.jsx";
import Field from "./Field.jsx";
import { C, STATUSES, input, ghost, icon } from "../theme.js";

export default function JobModal({ form, setForm, editing, onClose, onSave }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {editing ? "Edit application" : "Add application"}
        </h3>
        <button onClick={onClose} style={icon}><X size={17} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Company"><input style={input} value={form.company_name} onChange={set("company_name")} placeholder="Google" /></Field>
        <Field label="Role"><input style={input} value={form.role} onChange={set("role")} placeholder="SDE Intern" /></Field>
        <Field label="Status">
          <select style={input} value={form.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s} style={{ background: C.panel }}>{s}</option>)}
          </select>
        </Field>
        <Field label="Date applied"><input style={input} type="date" value={form.date_applied} onChange={set("date_applied")} /></Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Job link"><input style={input} value={form.job_link} onChange={set("job_link")} placeholder="https://..." /></Field>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Notes"><textarea style={{ ...input, minHeight: 82, resize: "vertical" }} value={form.notes} onChange={set("notes")} placeholder="Round details, deadlines, contacts..." /></Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
        <button onClick={onClose} style={ghost}>Cancel</button>
        <button onClick={onSave} style={{ ...ghost, background: C.clay, color: C.bone, border: "none" }}>
          {editing ? "Save changes" : "Add application"}
        </button>
      </div>
    </Overlay>
  );
}
