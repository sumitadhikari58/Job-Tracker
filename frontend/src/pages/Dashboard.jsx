import { useState, useEffect, useMemo } from "react";
import { Plus, Search, LogOut, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getJobs, createJob, updateJob, deleteJob } from "../api/jobs.js";
import { errorMessage } from "../api/client.js";
import Mark from "../components/Mark.jsx";
import JobCard from "../components/JobCard.jsx";
import JobModal from "../components/JobModal.jsx";
import AiModal from "../components/AiModal.jsx";
import { C, STATUSES, STATUS_COLOR, input, bigAction, ghost, rowSpan, todayISO } from "../theme.js";

const emptyForm = { company_name: "", role: "", status: "Applied", job_link: "", notes: "", date_applied: "" };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [aiOpen, setAiOpen] = useState(false);

  // fetch jobs once when the dashboard mounts
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const res = await getJobs();
      setJobs(res.data);
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Couldn't load your applications. Is the backend running?"));
    } finally {
      setLoading(false);
    }
  }

  const counts = useMemo(() => {
    const c = { All: jobs.length };
    STATUSES.forEach((s) => (c[s] = jobs.filter((j) => j.status === s).length));
    return c;
  }, [jobs]);

  const visible = useMemo(() => jobs.filter((j) => {
    const needle = query.trim().toLowerCase();
    const q = j.company_name.toLowerCase().includes(needle) || j.role.toLowerCase().includes(needle);
    const f = filter === "All" || j.status === filter;
    return q && f;
  }), [jobs, query, filter]);

  function openAdd() {
    setEditing(null);
    setFormError("");
    setForm({ ...emptyForm, date_applied: todayISO() });
    setModalOpen(true);
  }
  function openEdit(job) {
    // copy only the editable fields; nulls from MySQL become "" so inputs stay controlled.
    // date is trimmed to yyyy-mm-dd for the date input.
    setEditing(job.id);
    setFormError("");
    const fields = Object.fromEntries(Object.keys(emptyForm).map((k) => [k, job[k] ?? ""]));
    setForm({ ...fields, date_applied: String(fields.date_applied).slice(0, 10) });
    setModalOpen(true);
  }

  async function saveJob() {
    if (!form.company_name.trim() || !form.role.trim() || !form.date_applied) {
      setFormError("Company, role and date applied are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editing) await updateJob(editing, form);
      else await createJob(form);
      setModalOpen(false);
      loadJobs();   // refresh list from backend
    } catch (err) {
      setFormError(errorMessage(err, "Couldn't save. Try again."));
    } finally {
      setSaving(false);
    }
  }

  // quick status change from the card - backend accepts a partial update
  async function changeStatus(id, status) {
    const previous = jobs;
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, status } : j)));  // optimistic update
    try {
      await updateJob(id, { status });
    } catch (err) {
      setJobs(previous);
      setLoadError(errorMessage(err, "Couldn't update status."));
    }
  }

  async function removeJob(id) {
    const job = jobs.find((j) => j.id === id);
    if (!window.confirm(`Delete your ${job?.company_name ?? ""} application? This can't be undone.`)) return;
    try {
      await deleteJob(id);
      setJobs((p) => p.filter((j) => j.id !== id));
    } catch (err) {
      setLoadError(errorMessage(err, "Couldn't delete. Try again."));
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.base, color: C.bone }}>
      <header style={{ borderBottom: "1px solid " + C.line, position: "sticky", top: 0, background: C.base, zIndex: 20 }}>
        <div className="page-pad" style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Mark />
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.03em" }}>jobtrackr</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {user?.name && <span className="hide-sm" style={{ fontSize: 14, color: C.mute }}>Hi, {user.name}</span>}
            <button onClick={logout} style={ghost}><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="page-pad" style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 28px 90px" }}>
        <section className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 28, marginBottom: 40 }}>
          <div style={{ background: C.panel, border: "1px solid " + C.line, borderRadius: 20, padding: "34px 34px 30px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, background: "radial-gradient(circle, " + C.clayDim + "55, transparent 70%)" }} />
            <div style={{ fontSize: 13, color: C.mute, fontWeight: 600, letterSpacing: "0.04em" }}>Placement season - {new Date().getFullYear()}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 14 }}>
              <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9 }}>{counts.All}</span>
              <span style={{ fontSize: 17, color: C.mute, fontWeight: 500 }}>applications<br />in flight</span>
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 28, flexWrap: "wrap" }}>
              <HeroStat n={counts.Interview} label="interviewing" color={C.clay} />
              <HeroStat n={counts.OA} label="in assessment" color={C.sun} />
              <HeroStat n={counts.Offer} label="offers" color={STATUS_COLOR.Offer} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={openAdd} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none" }}>
              <span style={rowSpan}><Plus size={18} /> Add application</span><ArrowRight size={18} />
            </button>
            <button onClick={() => setAiOpen(true)} style={{ ...bigAction, background: C.panel, color: C.bone, border: "1px solid " + C.line }}>
              <span style={rowSpan}><Sparkles size={18} color={C.sun} /> Resume match score</span><ArrowUpRight size={18} color={C.mute} />
            </button>
            <div style={{ background: C.panel, border: "1px solid " + C.line, borderRadius: 16, padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              {STATUSES.map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: STATUS_COLOR[s] }} />
                  <span style={{ fontSize: 13, color: C.mute, flex: 1 }}>{s}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{counts[s]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <Search size={16} color={C.mute} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company or role" style={{ ...input, paddingLeft: 40 }} />
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {["All", ...STATUSES].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "9px 15px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: "1px solid " + (filter === f ? C.clay : C.line),
                background: filter === f ? C.clay : "transparent",
                color: filter === f ? C.bone : C.mute,
              }}>{f}</button>
            ))}
          </div>
        </div>

        {loadError && (
          <div role="alert" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid " + C.clay + "66", borderRadius: 12, color: C.clay, fontSize: 14 }}>
            <span>{loadError}</span>
            <button onClick={() => { setLoadError(""); loadJobs(); }} style={{ ...ghost, padding: "6px 12px", fontSize: 13 }}>Retry</button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "70px 20px", color: C.mute }}>Loading your board...</div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", border: "1px dashed " + C.line, borderRadius: 18, color: C.mute }}>
            {jobs.length === 0 ? "No applications yet. Add your first one to start tracking." : "Nothing matches this filter."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map((job) => <JobCard key={job.id} job={job} onEdit={openEdit} onDelete={removeJob} onStatusChange={changeStatus} />)}
          </div>
        )}
      </main>

      {modalOpen && <JobModal form={form} setForm={setForm} editing={editing} error={formError} saving={saving} onClose={() => setModalOpen(false)} onSave={saveJob} />}
      {aiOpen && <AiModal onClose={() => setAiOpen(false)} />}
    </div>
  );
}

function HeroStat({ n, label, color }) {
  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color }}>{n}</div>
      <div style={{ fontSize: 12.5, color: C.mute, marginTop: 2 }}>{label}</div>
    </div>
  );
}
