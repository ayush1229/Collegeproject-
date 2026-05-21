/**
 * api/client.js — Shared axios instance for room-allocation API calls
 *
 * Base URL: VITE_API_URL env var, or falls back to localhost:5000/api.
 * Auth: TODO — attach token from auth context once auth is implemented.
 */
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// TODO: attach auth token once auth is implemented
// client.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// Unwrap the axios response envelope so callers get data directly
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default client;
