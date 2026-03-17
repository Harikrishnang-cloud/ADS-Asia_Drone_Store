export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    status: "active" | "inactive";
    createdAt: number;
    updatedAt?: number;
}

export interface BannerFormData {
    title: string;
    imageUrl: string;
    link: string;
    status: "active" | "inactive";
}
