
import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './siderbar.component.html',
  styleUrl: './siderbar.component.css'
})
export class Sidebar {
  readonly auth = inject(AuthService);
}
