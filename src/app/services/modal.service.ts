import { Injectable, signal } from '@angular/core';

export type ModalType = 'info' | 'danger' | 'success' | 'warning';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isOpen = signal(false);
  message = signal('');
  type = signal<ModalType>('info');

  confirmCallback: (() => void) | null = null;
  cancelCallback: (() => void) | null = null;

  open(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    type: ModalType = 'info'
  ): void {
    this.message.set(message);
    this.confirmCallback = onConfirm;
    this.cancelCallback = onCancel || null;
    this.type.set(type);
    this.isOpen.set(true);
  }

  cancel() {
    if (this.cancelCallback) this.cancelCallback();
    this.isOpen.set(false);
  }


  close() {
    this.isOpen.set(false);
  }

  confirm() {
    if (this.confirmCallback) this.confirmCallback();
    this.close();
  }
}
