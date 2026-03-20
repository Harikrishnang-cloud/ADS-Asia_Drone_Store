export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pin?: string;
    walletBalance?: number;
    authProvider: string;
    status: "active" | "blocked";
    createdAt: any;
    profileImage?: string;
}

export interface UserFormData {
    name: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    pin?: string;
    status: "active" | "blocked";
}
