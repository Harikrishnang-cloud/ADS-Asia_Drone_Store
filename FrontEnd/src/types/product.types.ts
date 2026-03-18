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
}
