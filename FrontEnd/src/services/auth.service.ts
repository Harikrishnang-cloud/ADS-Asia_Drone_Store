import api from "../lib/axios";

export const authService = {
    // User Authentication
    login: async (credentials: Record<string, unknown>) => {
        const response = await api.post("/user/login", credentials);
        return response.data;
    },

    register: async (userData: Record<string, unknown>) => {
        const response = await api.post("/user/register", userData);
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/user/logout");
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post("/user/refresh-token");
        return response.data;
    },

    googleLogin: async (token: string) => {
        const response = await api.post("/auth/google-login", { token });
        return response.data;
    },

    // Admin Authentication
    adminLogin: async (credentials: Record<string, unknown>) => {
        const response = await api.post("/admin/login", credentials);
        return response.data;
    },

    adminLogout: async () => {
        const response = await api.post("/admin/logout");
        return response.data;
    },

    // Password Management
    forgotPassword: async (contact: string, method: 'email' | 'phone' = 'email') => {
        const response = await api.post("/auth/forgot-password", { contact, method });
        return response.data;
    },

    verifyResetOtp: async (data: { contact: string; otp: string; method?: 'email' | 'phone' }) => {
        const response = await api.post("/auth/verify-reset-otp", data);
        return response.data;
    },

    resetPassword: async (data: Record<string, unknown>) => {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    },

    resendResetOtp: async (contact: string, method: 'email' | 'phone' = 'email') => {
        const response = await api.post("/auth/resend-reset-otp", { contact, method });
        return response.data;
    }
};
