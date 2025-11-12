import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ProductDetails } from '../../../models/products.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  api = inject(ApiService);
  toast = inject(ToastService)

  productDetails = signal<ProductDetails | null>(null);
  selectedImage = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Product Id", id);
    this.getProductDetails(id);

  }

  getProductDetails(id: number) {
    this.api.getProductDetails(id).subscribe({
      next: (res: ProductDetails) => {
        this.productDetails.set(res);
        console.log(res);

      },
      error: (err: any) => {
        console.log("Product details error", err);

      }
    })
  }

  setSelectedImage(url: string) {
    this.selectedImage.set(url);
  }


  addToCart(productId: number | undefined, quantity: number) {
    this.api.addToCart({ productId, quantity }).subscribe({
      next: (res: any) => {
        console.log("add to cart res:", res);
        this.toast.show("Added to Cart!", "success")

        this.api.cartCount.set(res.uniqueProducts);
      },
      error: (err: any) => {
        console.log("add to cart err:", err);

      }
    })
  }
}
