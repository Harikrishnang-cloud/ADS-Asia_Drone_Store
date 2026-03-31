import api from "../lib/axios";

export const userService = {
    getProfile: async () => {
        const response = await api.get("/user/profile");
        return response.data;
    },
    
    updateProfile: async (userData: Record<string, unknown>) => {
        const response = await api.put("/user/profile", userData);
        return response.data;
    },
};
