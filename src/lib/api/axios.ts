import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './token-manager';

const baseURL = process.env.NEXT_PUBLIC_NODEJS_API_URL || 'https://www.apxteck.com/api/v1';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If the payload is FormData, we must let the browser set the Content-Type with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Pass cookies in Server Components (SSR)
    if (typeof window === 'undefined') {
      try {
        const nextHeaders = await import('next/headers');
        const cookieStorePromise = nextHeaders.cookies();
        const cookieStore = cookieStorePromise instanceof Promise 
            ? await cookieStorePromise 
            : cookieStorePromise;
            
        const allCookies = cookieStore.getAll();
        const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        if (cookieHeader) {
          config.headers.Cookie = config.headers.Cookie 
            ? `${config.headers.Cookie}; ${cookieHeader}`
            : cookieHeader;
        }
      } catch (error) {
        // Ignore errors if used outside request context
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Refresh logic state
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 && 
      originalRequest && 
      !originalRequest._retry && 
      !originalRequest.headers['X-Retry']
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest.headers['X-Retry'] = 'true';
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh
        const { data } = await axios.post(`${baseURL}/auth/refresh`, {}, { 
          withCredentials: true,
          headers: typeof window === 'undefined' && originalRequest.headers.Cookie 
            ? { Cookie: originalRequest.headers.Cookie } 
            : undefined
        });

        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Refresh token is invalid or missing');
        }
        
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers['X-Retry'] = 'true';
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAccessToken();

        if (typeof window !== 'undefined') {
          if (localStorage.getItem('isLoggedIn') === 'true') {
            localStorage.removeItem('isLoggedIn');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login?session_expired=true';
            }
          }
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
