import api from "./client.js";

// POST /api/auth/register
export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

// POST /api/auth/login -> returns { message, token }
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });
