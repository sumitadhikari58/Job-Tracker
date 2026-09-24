import api from "./client.js";

// GET /api/jobs
export const getJobs = () => api.get("/jobs");

// POST /api/jobs
export const createJob = (job) => api.post("/jobs", job);

// PUT /api/jobs/:id
export const updateJob = (id, job) => api.put(`/jobs/${id}`, job);

// DELETE /api/jobs/:id
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
