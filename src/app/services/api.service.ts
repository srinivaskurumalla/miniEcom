import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductDetails } from '../models/products.model';
import { Address, Login, LoginResult, Register, UserProfile } from '../models/users.model';
import { CartItem } from '../models/cart.item.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Global signals
  userName = signal<string | null>(null);
  cartCount = signal<number>(0);
  isLoggedIn = signal<boolean>(false);
  router = inject(Router);

  private http = inject(HttpClient)
  constructor() { }

  private API = `https://localhost:7156/api`;

  searchProducts(q?: string, page: number = 1): Observable<Product[]> {
    let params = new HttpParams().set('page', page);

    if (q && q.trim() !== '') {
      params = params.set('q', q.trim());
    }
    return this.http.get<Product[]>(`${this.API}/Products`, { params });
  }


  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API}/Products?limit=500`)
  }

  addProduct(formData: FormData) {
    return this.http.post(`${this.API}/Products`, formData);
  }

  register(user: Register) {
    return this.http.post(`${this.API}/Users/register`, user);
  }
  login(user: Login): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.API}/Users/login`, user);
  }

  getProductDetails(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.API}/products/${id}`)
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.API}/Cart`)
  }

  addToCart(product: { productId: number | undefined, quantity: number }) {
    return this.http.post<typeof product>(`${this.API}/Cart/add`, product);
  }


  removeCartItem(productId: number) {
    return this.http.delete(`${this.API}/Cart/${productId}`);
  }


  getCategories() {
    return this.http.get<{ id: number; name: string }[]>(`${this.API}/Products/categories`);
  }

  getAddresses() {
    return this.http.get<Address[]>(`${this.API}/address`);
  }

  addAddress(dto: any) {
    return this.http.post(`${this.API}/address`, dto);
  }

  updateAddress(id: number, dto: any) {
    return this.http.put(`${this.API}/address/${id}`, dto);
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.API}/address/${id}`);
  }

  setDefaultAddress(id: number) {
    return this.http.put(`${this.API}/address/set-default/${id}`, {});
  }


  // Initialize user data (call this after login or app reload)
  initializeUserState() {
    const token = sessionStorage.getItem('token');
    const userName = sessionStorage.getItem('userName');
    if (token) {
      this.isLoggedIn.set(true);
      this.userName.set(userName);
      // Optionally fetch username and cart count again
      this.getCartItems().subscribe({
        next: (res) => this.cartCount.set(res.length),
        error: () => this.cartCount.set(0),
      });
    }
  }
  getUserProfile() {
    return this.http.get<UserProfile>(`${this.API}/Users/Profile`);

  }

  logout() {
    sessionStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.userName.set(null);
    this.cartCount.set(0);
    this.router.navigate(['/login'])

  }
}
