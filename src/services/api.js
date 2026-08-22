import axios from 'axios';

/** Hugging Face Space that hosts the FastAPI backend */
const HF_SPACE_API = 'https://samuelyitakubayo-izere.hf.space';

function resolveApiBase() {
  const fromEnv = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  if (typeof window === 'undefined') return 'http://localhost:8000';

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  // Frontend and API on the same Space
  if (host.includes('hf.space') || host.includes('huggingface.co')) {
    return '';
  }
  // Production site (izerehealthhub.org) → Space API
  return HF_SPACE_API;
}

const api = axios.create({
  baseURL: resolveApiBase(),
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { resolveApiBase, HF_SPACE_API };
