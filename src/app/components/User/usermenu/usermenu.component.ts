import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { IconModule } from '../../common/icon/icon.module';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-usermenu',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './usermenu.component.html',
  styleUrl: './usermenu.component.css'
})
export class UsermenuComponent {
  isMenuOpen = false;
  api = inject(ApiService);
  router = inject(Router)
  modal = inject(ModalService);

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isMenuOpen = false;
  }

  viewProfile() {
    console.log('Navigating to profile...');
    this.router.navigate(['/profile']);
    this.isMenuOpen = false;
  }

  viewAddresses() {
    console.log('Navigating to addresses...');
    this.router.navigate(['/addresses']);
    this.isMenuOpen = false;
  }
  viewOrders() {
    console.log('Navigating to orders...');
    this.router.navigate(['/orders']);
    this.isMenuOpen = false;
  }


  logout() {
    debugger
    this.modal.open(
      'Are you sure you want to logout?',
      () => this.api.logout(),
      () => console.log('User stayed logged in'),
      'warning'
    )
    this.isMenuOpen = false;

  }
}
