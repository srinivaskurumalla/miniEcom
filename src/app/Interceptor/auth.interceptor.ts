import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const api = inject(ApiService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req).pipe(
    catchError((err: any) => {
      if (err.status == 401) {
        // Clear session and prompt user to login again
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userName');

        api.userName.set('');
        api.cartCount.set(0);
        toast.show('Your session has expired. Please log in again.', "error")
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
