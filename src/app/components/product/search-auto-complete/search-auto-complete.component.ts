import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-search-auto-complete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-auto-complete.component.html'
})
export class SearchAutoCompleteComponent {
  api = inject(ApiService);
  router = inject(Router);

  searchControl = new FormControl('');
  results = signal<{ products: any[]; tags: string[] }>({ products: [], tags: [] });
  loading = signal(false);

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query?.trim()) return of({ products: [], tags: [] });
          this.loading.set(true);
          return this.api.searchProductsAndTags(query.trim());
        })
      )
      .subscribe({
        next: (res:any) => {
          this.results.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  selectTag(tag: string) {
    this.router.navigate(['/products'], { queryParams: { tag } });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product-details', id]);
  }
}
