import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/Layout/header/header.component";
import { ApiService } from './services/api.service';
import { ToastComponent } from './components/common/toast/toast.component';
import { ConfirmModalComponent } from "./components/common/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'miniEcom';
  api = inject(ApiService);


  ngOnInit(): void {
    this.api.initializeUserState();
  }

}
