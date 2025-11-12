import { Component, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Register } from '../../../models/users.model';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const user: Register = this.registerForm.value as Register;
      console.log('Form Submitted:', this.registerForm.value);
      this.api.register(user).subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate(['/login'])
        },
        error: (err: any) => {
          console.log("register error:", err);

        }
      })
    }
  }
}
