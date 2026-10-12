import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor (insert token)
api.interceptors.request.use(
    async (config) => {
        // get session active from next auth
        const session = await getSession();

        // safety check: if session and token are available, insert into header
        if (session && (session as any).accessToken) {
            config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor (handle expired token)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // catch error from backend if status is 401 (Unauthorized / Token Expired)
        if (error.response && error.response.status === 401) {
            console.error('Token expired or invalid, redirecting user to login page...');

            // make sure this function only runs on the client side (browser)
            if (typeof window !== 'undefined') {
                await signOut({ callbackUrl: '/login' });
            }
        }

        return Promise.reject(error);
    }
);

export default api;