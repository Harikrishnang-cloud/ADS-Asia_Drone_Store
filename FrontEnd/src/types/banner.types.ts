export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    videoUrl?: string;
    type?: "image" | "video";
    link: string;
    status: "active" | "inactive";
    createdAt: number;
    updatedAt?: number;
}

export interface BannerFormData {
    title: string;
    imageUrl: string;
    videoUrl?: string;
    type: "image" | "video";
    link: string;
    status: "active" | "inactive";
}
