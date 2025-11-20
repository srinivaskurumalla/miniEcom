import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../models/users.model';
import { CheckoutRequest } from '../../../models/order.model';
import { CartItem } from '../../../models/cart.item.model';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  api = inject(ApiService);
  router = inject(Router);
  upiId = signal('');
  checkoutMessage = signal<string>('Place Order')

  toast = inject(ToastService);
  addresses = signal<Address[]>([]);
  currPrimaryAddress = signal<Address | null>(null);
  paymentMethod = signal<string>('COD');
  notes = signal<string>('');
  loading = signal<boolean>(false);
  successMessage = signal<string | null>(null);

  changeAddress = signal<boolean>(false);
  readonly PaymentMethods = ['COD', 'UPI', 'CARD'];

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses() {
    this.api.getAddresses().subscribe({
      next: (res: Address[]) => {
        this.addresses.set(res);
        const defaultAddr = res.find(a => a.isDefault);
        this.currPrimaryAddress.set(defaultAddr!);
      },
      error: (err) => console.error('Failed to load addresses', err)
    });
  }


  checkPayment() {
    if (!this.currPrimaryAddress()) {
      alert('Please select a shipping address.');
      return;
    }

    //UPI
    if (this.paymentMethod() == 'UPI') {
      if (!this.upiId()) {
        this.toast.show('Please enter a valid UPI ID', 'error');
        return;
      }

      this.toast.show(`UPI request sent to ${this.upiId()} for ₹${this.totalAmount().toFixed(2)}`, 'success');

      setTimeout(() => {
        // Simulate payment success after 3s
        this.toast.show(' Payment successful!', 'success');
        this.placeOrder(); // proceed to order
      }, 3000);
    }
    //COD
    else if (this.paymentMethod() == 'COD') {
      this.placeOrder();
    }




  }

  placeOrder() {
    const payload: CheckoutRequest = {
      shippingAddressId: this.currPrimaryAddress()?.id!,
      billingAddressId: this.currPrimaryAddress()?.id!, // same for now
      paymentMethod: this.paymentMethod(),
      notes: this.notes()
    };
    this.loading.set(true);

    this.api.checkout(payload).subscribe({
      next: (res: any) => {
        this.successMessage.set(`Order placed successfully! Order #${res.orderNumber}`);
        this.loading.set(false);
        this.api.cartCount.update(() => 0);
        //setTimeout(() => this.router.navigate(['/orders', res.orderId]), 1500);
        setTimeout(() => this.router.navigate(['/orders']), 1500);
      },
      error: (err: any) => {
        console.error('Checkout failed', err);
        this.loading.set(false);
        alert(err.error?.message || 'Checkout failed.');
      }
    });
  }

  selectAddress(addr: Address) {
    this.currPrimaryAddress.set(addr);
    this.changeAddress.set(false); //Hide the list again


  }

  subTotal = computed(() => this.cartService.subTotal());
  totalItems = computed(() => this.cartService.totalItems());

  taxPercent = 5;
  taxAmount = computed(() => (this.subTotal() * this.taxPercent) / 100);
  shippingCharge = computed(() => (this.subTotal() > 500 ? 0 : 49));
  totalAmount = computed(() =>
    this.subTotal() + this.taxAmount() + this.shippingCharge()
  );

  changePaymentMethod(method: string) {
    this.paymentMethod.set(method);
    this.checkoutMessage.set('Pay and Place Order')
  }
}
