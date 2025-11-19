import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CartItem } from '../../../models/cart.item.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconModule } from '../../common/icon/icon.module';
import { ModalService } from '../../../services/modal.service';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule, RouterLink, IconModule],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css'
})
export class CartItemsComponent implements OnInit {

  //api = inject(ApiService);
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems
  modal = inject(ModalService)
  router = inject(Router)
  toast = inject(ToastService);

  total = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  ngOnInit(): void {
    this.cartService.loadCart();
  }


  increase(item: CartItem) {
    const newQty = item.quantity + 1;
    if (newQty <= item.product.stockQuantity) {
      this.cartService.updateQuantity(item.product.id, newQty);
    } else {
      this.toast.show('Cannot exceed available stock', 'warning');
    }
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.cartService.updateQuantity(item.product.id, newQty);
    }
  }


  removeFromCart(item: CartItem) {

    this.modal.open(
      'Want to remove from cart?',
      () => {
        this.removeFromCartConfirmed(item);
      },
      () => {
        console.log('User cancelled removal');
      },
      'danger'
    )

  }

  removeFromCartConfirmed(item: CartItem) {
    this.cartService.removeFromCart(item.productId);
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }
}
