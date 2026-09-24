import api from "./client.js";

// POST /api/ai/resume-match (multipart) -> { score, verdict, summary, strengths, gaps }
// FormData is used because we're uploading a file; axios sets the multipart boundary itself.
export const resumeMatch = (file, jobDescription) => {
  const data = new FormData();
  data.append("resume", file);
  data.append("job_description", jobDescription);
  return api.post("/ai/resume-match", data);
};
