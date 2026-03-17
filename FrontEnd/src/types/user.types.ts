export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    authProvider: string;
    status: "active" | "blocked";
    createdAt: any;
    profileImage?: string;
}

export interface UserFormData {
    name: string;
    phone: string;
    status: "active" | "blocked";
}
