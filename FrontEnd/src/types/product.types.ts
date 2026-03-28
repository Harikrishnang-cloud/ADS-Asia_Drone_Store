export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    subCategory?: string;
    imageUrl: string;
    images: string[];
    stock: number;
    status: 'active' | 'inactive';
    createdAt: number;
    updatedAt?: number;
    offerPrice?: number;
    offerPercentage?: number;
    specifications?: { label: string; value: string }[];
    rating?: number;
    reviews?: number;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number | string;
    category: string;
    subCategory?: string;
    imageUrl: string;
    images: string[];
    stock: number | string;
    status: 'active' | 'inactive';
    offerPrice?: number | string;
    specifications?: { label: string; value: string }[];
    rating?: number;
    reviews?: number;
}
