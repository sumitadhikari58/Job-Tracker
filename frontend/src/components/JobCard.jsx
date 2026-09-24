import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { C, STATUSES, STATUS_COLOR, icon, fmtDate } from "../theme.js";

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
  return (
    <div style={{ background: C.panel, border: "1px solid " + C.line, borderRadius: 16, padding: "20px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div style={{ width: 4, alignSelf: "stretch", borderRadius: 4, background: STATUS_COLOR[job.status], flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{job.company_name}</h3>
          {/* status pill doubles as a dropdown for quick updates */}
          <select
            value={job.status}
            onChange={(e) => onStatusChange(job.id, e.target.value)}
            aria-label={`Status for ${job.company_name}`}
            style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[job.status], border: "1px solid " + STATUS_COLOR[job.status] + "44", padding: "3px 10px", borderRadius: 999, background: "transparent", cursor: "pointer", appearance: "none", fontFamily: "inherit" }}
          >
            {STATUSES.map((s) => <option key={s} value={s} style={{ background: C.panel, color: C.bone }}>{s}</option>)}
          </select>
        </div>
        <p style={{ margin: "5px 0 0", color: C.mute, fontSize: 14, overflowWrap: "anywhere" }}>{job.role}</p>
        {job.notes && <p style={{ margin: "12px 0 0", color: "#C4B9AB", fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{job.notes}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 13 }}>
          <span style={{ fontSize: 12, color: C.mute }}>Applied {fmtDate(job.date_applied)}</span>
          {job.job_link && <a href={job.job_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.sun, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>Posting <ExternalLink size={11} /></a>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => onEdit(job)} style={icon} title="Edit" aria-label="Edit"><Pencil size={15} /></button>
        <button onClick={() => onDelete(job.id)} style={icon} title="Delete" aria-label="Delete"><Trash2 size={15} /></button>
      </div>
    </div>
  );
}
