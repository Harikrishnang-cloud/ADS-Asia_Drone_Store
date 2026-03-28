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
        const isAdminRequest = config.url?.startsWith('/admin') || config.url?.includes('/admin/');
        let tokenKey = isAdminRequest ? "adminAccessToken" : "accessToken";
        
        let token = localStorage.getItem(tokenKey);

        // Fallback: If not an admin request but user token missing, try admin token
        if (!isAdminRequest && !token) {
            const adminToken = localStorage.getItem("adminAccessToken");
            if (adminToken) {
                token = adminToken;
                tokenKey = "adminAccessToken (Fallback)";
            }
        }
       
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
