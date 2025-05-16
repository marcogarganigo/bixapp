import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}


export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await axiosInstance.get('/auth/csrf/');
    if (response.status === 200 && response.data?.csrftoken) {
      return response.data.csrftoken;
    }
    return null;
  } catch (error) {
    console.error('Errore durante il recupero del CSRF token', error);
    return null;
  }
}

export interface LoginResponse {
  success: boolean;
  detail?: string;
}

async function getCsrf() {
  try {
    const resp = await axios.post('/postApi', {
      apiRoute: 'getCsrf',
    }); 
    console.log('CSRF Response:', resp.data);
  } catch (error) {
    console.error('Errore nel recupero CSRF', error);
  }
}

export async function loginUserApi(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    await getCsrf();

    const response = await axios.post('/postApi', {
      apiRoute: 'login',
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    const detail = error.response?.data?.error || 'Errore di rete';
    return {
      success: false,
      detail,
    };
  }
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  username?: string;
  name?: string;
}

export async function checkAuth(): Promise<CheckAuthResponse> {
  try {
    console.info('Verifica autenticazione...checkAuth');
    const response = await axios.post('/postApi', {
      apiRoute: 'checkAuth',
    });
    console.info(response);
    return {
      isAuthenticated: response.data.isAuthenticated,
      username: response.data.username,
      name: response.data.name,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { isAuthenticated: false };
    }
    console.error('Errore durante il controllo di autenticazione', error);
    return { isAuthenticated: false };
  }
}

export interface LogoutResponse {
  success: boolean;
  detail?: string;
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const csrfToken = getCookie('csrftoken');
    const response = await axiosInstance.post('/auth/logout/', null, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Errore durante il logout', error);
    return { success: false, detail: 'Errore di rete' };
  }
}
