import { Injectable, signal } from '@angular/core';
import { ToastOptions } from '../models/ToastOptions';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastOptions[]>([]);

  show(message: string, type: ToastOptions['type'] = 'info', duration = 3000) {
    const toast: ToastOptions = { message, type, duration };
    this.toasts.update((t) => [...t, toast]);

    // Auto-remove after duration
    setTimeout(() => this.remove(toast), duration);
  }

  remove(toast: ToastOptions) {
    this.toasts.update((t) => t.filter((x) => x !== toast));
  }
}
