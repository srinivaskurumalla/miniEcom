import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { IconModule } from '../../common/icon/icon.module';
import { ApiService } from '../../../services/api.service';

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
    // this.router.navigate(['/profile']);
    this.isMenuOpen = false;
  }

  viewAddresses() {
    console.log('Navigating to addresses...');
    // this.router.navigate(['/addresses']);
    this.isMenuOpen = false;
  }

  logout() {
    console.log('Logging out...');
    // Add your logout logic
    this.api.logout();
    this.isMenuOpen = false;
  }
}
