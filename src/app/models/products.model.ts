export interface ProductImage {
  id: number;
  fileName: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  shortDescription: string;
  images: ProductImage[];
}
export interface ProductDetails {
  id: number;
  sku: string;
  name: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  shortDescription: string;
  longDescription: string;
  images: ProductImage[];
}

export interface ProductSearchResult{
  id:number
  name:string
  shortDescription: string;
}
export interface Categories{
  id:number
  name:string
}