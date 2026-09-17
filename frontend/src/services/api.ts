import axios from 'axios';

// Usamos VITE_API_URL en producción, o ruta relativa en desarrollo local para que funcione el proxy
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});
