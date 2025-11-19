import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Categories } from '../../../models/products.model';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  fb = inject(FormBuilder);
  api = inject(ApiService);
  selectedImages: string[] = [];
  categories: Categories[] = [];

  ngOnInit(): void {
    //Load Categories from API
    this.fetchCategories();

    // Auto-generate SKU when relevant fields change
    this.setupSkuGenerator();
  }

  productForm = this.fb.group({
    categoryId: ['', Validators.required],
    sku: ['', Validators.required],
    name: ['', Validators.required],
    shortDescription: [''],
    longDescription: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    mrp: [null],
    taxPercent: [0],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
    images: [null as FileList | null] // will hold FileList
  })


  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.selectedImages.push(e.target.result);
      reader.readAsDataURL(files[i]);
    }

    this.productForm.patchValue({ images: files });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (key == 'images' && value) {
        Array.from(value as FileList).forEach((file) => {
          formData.append('images', file);
        })
      } else if (value != null && value != undefined) {
        formData.append(key, value as any)
      }
    });


    this.api.addProduct(formData).subscribe({
      next: (res) => {
        alert('✅ Product added successfully!');
        this.productForm.reset({ isActive: true });
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error adding product.');
      }
    });
  }

  fetchCategories() {
    this.api.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error("Error fetching categories", err),
    });
  }

  setupSkuGenerator() {
    this.productForm.valueChanges.subscribe(values => {
      const { name, categoryId, price } = values;

      if (name && categoryId && price) {
        const category = this.categories.find(c => c.id == +categoryId);
        const catCode = category ? category.name.slice(0, 3).toUpperCase() : 'GEN';
        const nameCode = name.slice(0, 3).toUpperCase();
        const randomCode = Math.floor(100 + Math.random() * 900); // 3-digit unique suffix

        const generatedSku = `${catCode}-${nameCode}-${randomCode}`;
        this.productForm.get('sku')?.setValue(generatedSku, { emitEvent: false });
      }
    });
  }
}
