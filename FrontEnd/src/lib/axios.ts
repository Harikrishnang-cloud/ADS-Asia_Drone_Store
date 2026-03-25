import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7878",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor for attaching tokens
api.interceptors.request.use(
    (config) => {
        const isAdminRequest = config.url?.startsWith('/admin');
        const tokenKey = isAdminRequest ? "adminAccessToken" : "accessToken";
        
        const token = localStorage.getItem(tokenKey);
        console.log(`Axios Request to ${config.url} - Token key used: ${tokenKey} - Token found: ${!!token}`);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        
        if (error.response?.status === 401) {
            console.error("Unauthorized access, redirecting...");
        } else if (error.response?.status === 403) {
            toast.error("You do not have permission to perform this action");
        } else if (error.response?.status === 429) {
            toast.error("Too many requests. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default api;
