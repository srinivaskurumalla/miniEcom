import { CommonModule } from '@angular/common';
import { Component, inject, Signal, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { IconModule } from '../../common/icon/icon.module';
import { UsermenuComponent } from '../../User/usermenu/usermenu.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,IconModule,UsermenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  api = inject(ApiService);
  cartCount = this.api.cartCount();
  showMenu = signal(false);

  isDarkMode = signal<boolean>(false);

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    const html = document.documentElement;

    if (this.isDarkMode()) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  constructor(private router: Router) {
    // Load from localStorage (persist user preference)
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkMode.set(true);
    }

  }
  toggleMenu() {
    this.showMenu.set(!this.showMenu());
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.api.logout();
  }
}
