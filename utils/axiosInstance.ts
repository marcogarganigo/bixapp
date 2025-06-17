import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const apiRoute = config.data?.apiRoute ? ` | apiRoute: ${config.data.apiRoute}` : "";
    console.log(`[AxiosInstanceClient Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}${apiRoute}`);
    return config;
}, (error) => {
    console.error("[AxiosInstanceClient Request Error]", error);
    toast.error('Errore durante la richiesta, è stato segnalato ai tecnici', error);

    axiosInstance.post('/postApi', {
        apiRoute: 'logError',
        error: error.message,
    }, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    
    return Promise.reject(error);
});

export default axiosInstance;
