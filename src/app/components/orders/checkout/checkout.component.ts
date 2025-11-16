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


  placeOrder() {
    if (!this.currPrimaryAddress()) {
      alert('Please select a shipping address.');
      return;
    }

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
        setTimeout(() => this.router.navigate(['/orders', res.orderId]), 1500);
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

}
