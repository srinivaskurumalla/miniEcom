import { Component, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Login, LoginResult, Register } from '../../../models/users.model';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../../models/cart.item.model';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  fb = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router);
  toast = inject(ToastService);
  loading = signal<boolean>(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const user: Login = this.loginForm.value as Login;
      console.log('Form Submitted:', this.loginForm.value);
      this.api.login(user).subscribe({
        next: (res: LoginResult) => {
          console.log('Login success:', res);
          this.loading.set(false);

          // Store token and user info
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('userName', res.userName);
          this.api.userName.set(res.userName);
          this.api.isLoggedIn.set(true);

          this.toast.show('Logged in successfully!', 'success');

          // Fetch cart count once logged in
          this.api.getCartItems().subscribe({
            next: (res: CartItem[]) => this.api.cartCount.set(res.length),
            error: () => this.api.cartCount.set(0),
          });
          this.router.navigate(['/products'])

        },
        error: (err: any) => {
          this.loading.set(false);
          this.toast.show(err.error.message, 'error');
          console.log("login error:", err);

        }

      })

      this.loading.set(false);
    }
  }
}
