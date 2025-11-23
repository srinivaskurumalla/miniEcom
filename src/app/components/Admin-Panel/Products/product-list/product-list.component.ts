import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../../models/products.model';
import { ProductService } from '../product.service';
import { ConfirmModalComponent } from '../../../common/confirm-modal/confirm-modal.component';
import { ModalService } from '../../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ProductEditModalComponent } from '../product-edit-modal/product-edit-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductEditModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  showModal = signal(false);
  modal = inject(ModalService)

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products.set(res);
        console.log('Products', res);

      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  openEditModal(product: Product) {
    this.selectedProduct.set(product);
    this.showModal.set(true);
  }

  closeModal(refresh: boolean = false) {
    this.showModal.set(false);
    this.selectedProduct.set(null);
    if (refresh) this.loadProducts();
  }

  confirmDelete(productId: number) {
    this.modal.open('Are you sure you want to delete this product?',
      () => {
        this.productService.delete(productId).subscribe({
          next: () => this.loadProducts(),
          error: (err) => console.error('Delete failed', err)
        });
      },

      () => {
        console.log('Admin chose cancel to delete the product');

      },
      'warning'
    )
  }

}
