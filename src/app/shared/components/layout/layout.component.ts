import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header.component';
import { Sidebar } from '../siderbar/siderbar.component';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
  readonly auth = inject(AuthService);
}
