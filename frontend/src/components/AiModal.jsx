import { useState } from "react";
import { Sparkles, Upload } from "lucide-react";
import Overlay from "./Overlay.jsx";
import Field from "./Field.jsx";
import { C, STATUS_COLOR, input, bigAction, rowSpan } from "../theme.js";
import { errorMessage } from "../api/client.js";
import { resumeMatch } from "../api/ai.js";

const MAX_FILE_MB = 5;

export default function AiModal({ onClose }) {
  const [stage, setStage] = useState("input");
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!jd.trim() || !file) {
      setError("Add both a resume and a job description.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Resume must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    setError("");
    setStage("loading");
    try {
      // send resume + JD to the backend, which calls the AI model.
      const res = await resumeMatch(file, jd);
      setResult(res.data);
      setStage("result");
    } catch (err) {
      setError(errorMessage(err, "Couldn't analyze right now. Try again."));
      setStage("input");
    }
  }

  return (
    <Overlay onClose={onClose} width={560}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Sparkles size={19} color={C.sun} />
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Resume match score</h3>
      </div>
      <p style={{ color: C.mute, fontSize: 14, margin: "0 0 22px" }}>
        Paste a job description and add your resume to see how you match - and what to sharpen.
      </p>

      {stage === "input" && (
        <>
          <label style={{ border: "1px dashed " + C.line, borderRadius: 14, padding: 22, textAlign: "center", marginBottom: 16, cursor: "pointer", background: C.panel, display: "block" }}>
            <Upload size={22} color={C.mute} />
            <p style={{ margin: "8px 0 0", fontSize: 14, color: C.bone, fontWeight: 500 }}>Upload resume (PDF)</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.mute }}>{file ? file.name : "No file selected"}</p>
            <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
          <Field label="Job description">
            <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job description here..." style={{ ...input, minHeight: 110, resize: "vertical" }} />
          </Field>
          {error && <p style={{ color: C.clay, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
          <button onClick={analyze} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none", width: "100%", justifyContent: "center", marginTop: 6 }}>
            <span style={rowSpan}><Sparkles size={16} /> Analyze match</span>
          </button>
        </>
      )}

      {stage === "loading" && (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <div style={{ width: 34, height: 34, border: "3px solid " + C.line, borderTopColor: C.clay, borderRadius: "50%", margin: "0 auto", animation: "spin 0.7s linear infinite" }} />
          <p style={{ color: C.mute, marginTop: 16, fontSize: 14 }}>Reading your resume against the role...</p>
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        </div>
      )}

      {stage === "result" && result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 22, background: C.panel, border: "1px solid " + C.line, borderRadius: 14, marginBottom: 18 }}>
            <div style={{ position: "relative", width: 76, height: 76 }}>
              <svg width="76" height="76" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="38" cy="38" r="31" fill="none" stroke={C.line} strokeWidth="7" />
                <circle cx="38" cy="38" r="31" fill="none" stroke={C.clay} strokeWidth="7" strokeDasharray={2 * Math.PI * 31} strokeDashoffset={2 * Math.PI * 31 * (1 - result.score / 100)} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 21 }}>{result.score}%</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{result.verdict}</div>
              <div style={{ color: C.mute, fontSize: 13, marginTop: 3 }}>{result.summary}</div>
            </div>
          </div>
          <Block title="You're strong on" color={STATUS_COLOR.Offer} items={result.strengths} />
          <Block title="Gaps to address" color={C.clay} items={result.gaps} />
          <button onClick={onClose} style={{ ...bigAction, background: C.clay, color: C.bone, border: "none", width: "100%", justifyContent: "center", marginTop: 4 }}>Done</button>
        </div>
      )}
    </Overlay>
  );
}

function Block({ title, items, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(items || []).map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "10px 13px", background: C.panel, border: "1px solid " + C.line, borderRadius: 9, fontSize: 13, color: "#C4B9AB" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginTop: 6, flexShrink: 0 }} />{it}
          </div>
        ))}
      </div>
    </div>
  );
}
