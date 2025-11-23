import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Product } from '../../../../models/products.model';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-edit-modal',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit-modal.component.html',
  styleUrl: './product-edit-modal.component.css'
})
export class ProductEditModalComponent implements OnChanges {


  @Input() product!: Product | null;
  @Output() close = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  form = this.fb.group({
    id: [0],
    name: [''],
    price: [0],
    stockQuantity: [0],
    shortDescription: [''],
    longDescription: [''],
    isActive: [true],
    tags: ['']
  });

  selectedFiles: File[] = [];
  previewImages: string[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']?.currentValue) {
      if (this.product != null) {
        this.form.patchValue(this.product);
        this.previewImages = this.product.images.map(i => i.imageUrl);
      }
    }
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = files;

    this.previewImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImages.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  saveChanges() {
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key === 'tags' && typeof value === 'string') {
        const tags = value.split(',').map(t => t.trim());
        tags.forEach(t => formData.append('tags', t));
      } else if (value != null) {
        formData.append(key, value as any);
      }
    });

    this.selectedFiles.forEach(f => formData.append('images', f));

    this.productService.update(formData).subscribe({
      next: () => this.close.emit(true),
      error: (err) => console.error('Update failed', err)
    });
  }

  removeImage(url: string) {
    this.previewImages = this.previewImages.filter(i => i !== url);
    // Optionally: mark to delete this image from backend
  }
}
