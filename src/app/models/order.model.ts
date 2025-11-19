

export interface CheckoutRequest {
  shippingAddressId: number;
  billingAddressId?: number;
  paymentMethod: string;
  notes?: string;
}



export interface OrderItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  orderPlacedAt: string;
  totalAmount: number;
  orderStatus: string;
  isPaid: boolean;
  items: OrderItem[];
}