export interface Product {
    id: string
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    // type: Type; Todo
    gender: Catogory
}

export interface ProductWImages {
    id: string
    description: string;
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    gender: Catogory;
    productImages: ProductImage[];
}

interface ProductImage {
    url: string;
    id: number;
}

export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    size: Size;
    image: string;
}

export type Catogory = 'men' | 'women' | 'kid' | 'unisex';
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';
