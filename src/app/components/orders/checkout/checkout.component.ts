import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../models/users.model';
import { CheckoutRequest } from '../../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  api = inject(ApiService);
  router = inject(Router);


  addresses = signal<Address[]>([]);
  selectedAddressId = signal<number | null>(null);
  paymentMethod = signal<string>('COD');
  notes = signal<string>('');
  loading = signal<boolean>(false);
  successMessage = signal<string | null>(null);

  readonly PaymentMethods = ['COD', 'UPI', 'CARD'];

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses() {
    this.api.getAddresses().subscribe({
      next: (res: Address[]) => {
        this.addresses.set(res);
        const defaultAddr = res.find(a => a.isDefault);
        if (defaultAddr) this.selectedAddressId.set(defaultAddr.id);
      },
      error: (err) => console.error('Failed to load addresses', err)
    });
  }


  placeOrder() {
    if (!this.selectedAddressId()) {
      alert('Please select a shipping address.');
      return;
    }

    const payload: CheckoutRequest = {
      shippingAddressId: this.selectedAddressId()!,
      billingAddressId: this.selectedAddressId()!, // same for now
      paymentMethod: this.paymentMethod(),
      notes: this.notes()
    };
    this.loading.set(true);

    this.api.checkout(payload).subscribe({
      next: (res: any) => {
        this.successMessage.set(`Order placed successfully! Order #${res.orderNumber}`);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/orders', res.orderId]), 1500);
      },
      error: (err: any) => {
        console.error('Checkout failed', err);
        this.loading.set(false);
        alert(err.error?.message || 'Checkout failed.');
      }
    });
  }
}
