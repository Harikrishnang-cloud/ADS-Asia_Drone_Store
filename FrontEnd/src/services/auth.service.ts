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
    
    logout: async (refreshToken: string) => {
        const response = await api.post("/user/logout", { refreshToken });
        return response.data;
    },
    
    refreshToken: async (token: string) => {
        const response = await api.post("/user/refresh-token", { refreshToken: token });
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
    
    adminLogout: async (refreshToken: string) => {
        const response = await api.post("/admin/logout", { refreshToken });
        return response.data;
    },

    // Password Management
    forgotPassword: async (email: string) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },
    
    verifyResetOtp: async (data: { email: string; otp: string }) => {
        const response = await api.post("/auth/verify-reset-otp", data);
        return response.data;
    },
    
    resetPassword: async (data: Record<string, unknown>) => {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    },
    
    resendResetOtp: async (email: string) => {
        const response = await api.post("/auth/resend-reset-otp", { email });
        return response.data;
    }
};
