import { Component, inject, OnInit, signal } from '@angular/core';
import { Address } from '../../../models/users.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {

  addresses = signal<Address[]>([]);
  showForm = signal<boolean>(false);
  editingId: number | null = null;
  loading = signal<boolean>(false);

  fb = inject(FormBuilder);
  api = inject(ApiService);

  addressForm = this.fb.group({
    label: [''],
    recipientName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: [''],
    phone: [''],
    isDefault: [false],
  })


  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading.set(true);
    this.api.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  addAddress() {
    this.showForm.set(true);
    this.editingId = null;
    this.addressForm.reset({ isDefault: false });
  }


  editAddress(addr: Address) {
    this.showForm.set(true);
    this.editingId = addr.id;
    this.addressForm.patchValue(addr);
  }

  deleteAddress(id: number) {
    if (!confirm('Delete this address?')) return;
    this.api.deleteAddress(id).subscribe(() => this.loadAddresses());
  }


  setDefault(id: number) {
    this.api.setDefaultAddress(id).subscribe(() => this.loadAddresses());
  }

  onSubmit() {
    if (this.addressForm.invalid) return;
    const dto = this.addressForm.value;

    if (this.editingId) {
      this.api.updateAddress(this.editingId, dto).subscribe(() => {
        this.showForm.set(false);
        this.loadAddresses();
      });
    } else {
      this.api.addAddress(dto).subscribe(() => {
        this.showForm.set(false);
        this.loadAddresses();
      });
    }
  }

  cancel() {
    this.showForm.set(false);
    this.editingId = null;
  }
}
