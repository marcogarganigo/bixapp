'use client';

import axios from 'axios';
import { toast } from 'sonner';


const axiosInstanceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PORTAL_BASE_URL,
  withCredentials: true,
});

axiosInstanceClient.interceptors.request.use((config) => {
  const apiRoute = config.data?.apiRoute ? ` | apiRoute: ${config.data.apiRoute}` : "";
  console.log(`[AxiosInstanceClient Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}${apiRoute}`);
  return config;
}, (error) => {
  console.error("[AxiosInstanceClient Request Error]", error);
  toast.error('Errore durante la richiesta, è stato segnalato ai tecnici', error);
  axiosInstanceClient.post('/postApi', {
    apiRoute: 'logError',
    error: error.message,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return Promise.reject(error);
});

axiosInstanceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.log('AxiosInstanceClient: Sessione non valida o scaduta. Redirect al login...');
      toast.error('Errore di autenticazione', error);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceClient;
