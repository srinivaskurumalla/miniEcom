import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../models/products.model';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { SearchAutoCompleteComponent } from "../search-auto-complete/search-auto-complete.component";
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, SearchAutoCompleteComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {


  readonly PAGE_SIZE = 20;
  readonly MAX_VISIBLE_PAGES = 5;

  // ✅ Initialize signal with empty array, never undefined
  allProducts = signal<Product[]>([]);
  currentPage = signal<number>(0);
  searchQuery: string = "";

  apiService = inject(ApiService);
  router = inject(Router);
  //snack = inject(MatSnackBar)
  loading = signal(false);
  toast = inject(ToastService)

  // Derived values
  start = computed(() => this.currentPage() * this.PAGE_SIZE);
  end = computed(() => this.start() + this.PAGE_SIZE);


  canPrevious = computed(() => this.currentPage() > 0);
  canNext = computed(() => this.currentPage() < this.noOfPages() - 1);

  // ✅ Safe slice even if data is empty
  result = computed(() =>
    (this.allProducts() ?? []).slice(this.start(), this.end())
  );

  totalProducts = computed(() => this.allProducts().length);
  noOfPages = computed(() => Math.ceil(this.totalProducts() / this.PAGE_SIZE));
  pageNumbers = computed(() =>
    Array.from({ length: this.noOfPages() }, (_, i) => i)
  );

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading.set(true);
    this.apiService.searchProducts(this.searchQuery, 1).subscribe({
      next: (res: Product[]) => {
        this.allProducts.set(res); // ✅ fixed
        console.log('Fetched products:', res);
        console.log('Computed result:', this.result());
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading.set(false);
      },
    });
  }

  previousPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.noOfPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.noOfPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }


  goToProductDetails(productId: number) {
    this.router.navigate(['/product-details', productId])
  }


  addToCart(item: Product, event: Event) {
    event.stopPropagation();
    // Add to cart logic
    const productId = item.id;
    const quantity = 1;
    this.apiService.addToCart({ productId, quantity }).subscribe({
      next: (res: any) => {
        console.log("add to cart res:", res);
        // this.snack.open('✅ Added to cart!', '', { duration: 1500 })
        this.toast.show("Added to Cart!", "success")
        this.apiService.cartCount.set(res.uniqueProducts);

      },
      error: (err: any) => {
        console.log("add to cart err:", err);
        this.toast.show('Failed to add to cart.', "error")
        // this.snack.open('❌ Failed to add to cart.', '', { duration: 1500 })
      }
    })
  }

}
