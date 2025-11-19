import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Order } from '../../../models/order.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {


  api = inject(ApiService);
  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadMyOrders();
  }
  
  loadMyOrders() {
    this.api.getOrders().subscribe({
      next: (res: Order[]) => {
        this.orders.set(res);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to fetch orders', err);
        this.loading.set(false);
      },
    });
  }
}

