import { Component, inject, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductSearchResult } from '../../../models/products.model';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-search-auto-complete',
  standalone: true,
  imports: [CommonModule, FormsModule, FormsModule],
  templateUrl: './search-auto-complete.component.html',
  styleUrl: './search-auto-complete.component.css'
})
export class SearchAutoCompleteComponent implements OnInit {
  private searchSub?: Subscription;
  showResult: boolean = false;
  searchQuery: string = '';
  result = signal<ProductSearchResult[]>([]);
  product!: ProductSearchResult
  private apiService = inject(ApiService);

  searchTimeout: any;

  selectedItem = ''

  private cache: { [query: string]: ProductSearchResult[] } = {};
  loading = false
  ngOnInit(): void {

  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;

    this.searchQuery = target.value.trim(); // trim spaces

    // Clear previous timeout
    clearTimeout(this.searchTimeout);

    // If input is empty, clear results and cancel subscription
    if (!this.searchQuery) {
      this.result.set([]); // update signal
      this.searchSub?.unsubscribe()
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.callSearchApi(this.searchQuery)
    }, 300); // 300ms debounce



  }

  private callSearchApi(query: string) {

    //check the cache first
    if (this.cache[query]) {
      console.log("Using cache for:", query);
      this.result.set(this.cache[query]);
      return;
    }
    this.loading = true;
    this.searchSub?.unsubscribe(); // cancel previous request
    console.log("API Call", query);
    this.searchSub = this.apiService.searchProducts(query, 1).subscribe(
      {
        next: (res: Product[]) => {
          console.log(res);
          this.loading = false;
          const filtered = res
            .filter((p: Product) => p.name.toLowerCase().includes(query.toLowerCase()))
            .map((p: Product) =>
            ({
              id: p.id,
              name: p.name,
              shortDescription: p.shortDescription

            })
            );

          //store in cache
          this.cache[query] = filtered;

          this.result.set(filtered); // update signal
          console.log(this.result());

        },
        error: (err) => {
          console.error('Error fetching products:', err);
        }

      }
    );
  }
  showResults(show: boolean) {
    this.showResult = show;
  }

  selectItem(item: ProductSearchResult) {
    this.selectedItem = item.name;
    this.result.set([]);
    this.searchQuery = item.name;
    console.log("selected item", item);
    
  }
}
