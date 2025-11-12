import { Product } from "./products.model"

export interface CartItem{
    id:number
    productId:number
    quantity : number
    addedAt:Date
    product:Product
}