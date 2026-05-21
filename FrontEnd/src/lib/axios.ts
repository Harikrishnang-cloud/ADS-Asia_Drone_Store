import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7878",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor not needed for attaching tokens anymore as HttpOnly cookies are used
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access, redirecting...");
            if (typeof window !== "undefined" && !window.location.pathname.includes('/auth/login')) {
                toast.error("Please log in again to continue");

            }
        } else if (error.response?.status === 403) {
            toast.error("You don't have access to this action");
        } else if (error.response?.status === 429) {
            toast.error("Too many attempts. Please wait a moment");
        }
        return Promise.reject(error);
    }
);

export default api;
