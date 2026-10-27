import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  confirmarPassword = '';
  error = '';
  cargando = false;

  registrar(): void {
    if (!this.nombre.trim() || !this.email.trim() || this.password.length < 6) {
      this.error = 'Completa los campos. La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.error = '';
    this.cargando = true;

    this.auth.register({
      nombre: this.nombre.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigateByUrl('/login');
      },
      error: err => {
        this.cargando = false;
        this.error = err.status === 409
          ? 'Este correo ya está registrado.'
          : 'No se pudo completar el registro.';
      }
    });
  }
}
