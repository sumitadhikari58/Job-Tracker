import { X } from "lucide-react";
import Overlay from "./Overlay.jsx";
import Field from "./Field.jsx";
import { C, STATUSES, input, ghost, icon } from "../theme.js";

export default function JobModal({ form, setForm, editing, error, saving, onClose, onSave }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    onSave();
  }

  return (
    <Overlay onClose={onClose}>
      <form onSubmit={submit}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {editing ? "Edit application" : "Add application"}
        </h3>
        <button type="button" onClick={onClose} style={icon} aria-label="Close"><X size={17} /></button>
      </div>
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Company"><input style={input} value={form.company_name} onChange={set("company_name")} placeholder="Google" required maxLength={100} autoFocus /></Field>
        <Field label="Role"><input style={input} value={form.role} onChange={set("role")} placeholder="SDE Intern" required maxLength={100} /></Field>
        <Field label="Status">
          <select style={input} value={form.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s} style={{ background: C.panel }}>{s}</option>)}
          </select>
        </Field>
        <Field label="Date applied"><input style={input} type="date" value={form.date_applied} onChange={set("date_applied")} required /></Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Job link"><input style={input} type="url" value={form.job_link} onChange={set("job_link")} placeholder="https://..." maxLength={500} /></Field>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Notes"><textarea style={{ ...input, minHeight: 82, resize: "vertical" }} value={form.notes} onChange={set("notes")} placeholder="Round details, deadlines, contacts..." /></Field>
        </div>
      </div>
      {error && <p role="alert" style={{ color: C.clay, fontSize: 13, margin: "12px 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
        <button type="button" onClick={onClose} style={ghost}>Cancel</button>
        <button type="submit" disabled={saving} style={{ ...ghost, background: C.clay, color: C.bone, border: "none", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : editing ? "Save changes" : "Add application"}
        </button>
      </div>
      </form>
    </Overlay>
  );
}
