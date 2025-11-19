import { effect, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.item.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  constructor(private api: ApiService) {
    const stored = localStorage.getItem('cart');
    if (stored) this.cartItems.set(JSON.parse(stored));

    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    });
  }

  // ✅ Load cart items from backend
  loadCart() {
    this.api.getCartItems().subscribe({
      next: (res: CartItem[]) => {
        this.cartItems.set([...res]);
        console.log("cart", this.cartItems());

      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  // ✅ Add new item (update both UI + backend)
  addToCart(productId: number, quantity = 1) {
    this.api.addToCart({ productId, quantity }).subscribe({
      next: (res: any) => {
        this.loadCart(); // re-fetch updated cart
      },
      error: (err) => console.error('Add to cart failed', err)
    });
  }
  // ✅ Remove item
  removeFromCart(productId: number) {
    this.api.removeCartItem(productId).subscribe({
      next: () => {
        this.loadCart();
        localStorage.removeItem('cart')
      },
      error: (err) => console.error('Remove from cart failed', err)
    });
  }

  // ✅ Get totals
  totalItems = () => this.cartItems().reduce((sum, i) => sum + i.quantity, 0);
  subTotal = () => this.cartItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  updateQuantity(productId: number, quantity: number) {
    const product = { productId, quantity };
    this.api.addToCart(product).subscribe({
      next: () => {
        this.cartItems.update(items =>
          items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          )
        );
      },
      error: (err) => console.error('Failed to update cart quantity', err)

    });
  }
}
