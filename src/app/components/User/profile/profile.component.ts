import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserProfile } from '../../../models/users.model';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  api = inject(ApiService);
  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  router = inject(Router);

  ngOnInit() {
    this.api.getUserProfile().subscribe({
      next: (res: UserProfile) => {
        console.log("Profile", res);

        this.profile.set(res);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading profile', err);
        this.loading.set(false);
      }
    });
  }


  editProfile() {
    // TODO: Navigate to edit profile page or open modal
    console.log('Edit profile clicked');
  }

  manageAddresses() {
    // Navigate to /addresses
    this.router.navigate(['/addresses'])
  }

  changePassword() {
    // TODO: Open password update modal
  }
}
