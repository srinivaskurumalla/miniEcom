import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../models/products.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7156/api/products';

  getAll(page: number = 1, pageSize: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/?page=${page}&pageSize=${pageSize}`);
  }


  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  update(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
