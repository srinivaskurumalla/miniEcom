import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CartItem } from '../../../models/cart.item.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconModule } from '../../common/icon/icon.module';


@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule, RouterLink,IconModule],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css'
})
export class CartItemsComponent implements OnInit {

  api = inject(ApiService);
  cartItems = signal<CartItem[]>([]);
  total = signal<number>(0);

  ngOnInit(): void {
    this.loadCartItems();
  }


  loadCartItems() {
    this.api.getCartItems().subscribe({
      next: (res: CartItem[]) => {
        console.log("cart items:", res);
        this.cartItems.set(res);
        this.calculateTotal();

      },
      error: (err: any) => {
        console.log("cart load error", err);

      }
    })
  }


  calculateTotal() {
    const total = this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    this.total.set(total);
  }

  increase(item: CartItem) {
    item.quantity++;
    this.calculateTotal();
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) item.quantity--;
    this.calculateTotal();
  }

 removeFromCart(item: CartItem) {
  if (confirm(`Remove ${item.product.name} from cart?`)) {
    this.api.removeCartItem(item.product.id).subscribe({
      next: () => {
        this.cartItems.update((items) => items.filter((x) => x.id !== item.id));
        this.calculateTotal();
      },
      error: (err:any) => {
        console.error('Failed to remove item', err);
      },
    });
  }
}

}
