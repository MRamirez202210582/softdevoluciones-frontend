import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  cargando = false;

  entrar(): void {
    if (!this.email.trim() || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.error = '';
    this.cargando = true;

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: respuesta => {
        this.cargando = false;

        const rol = respuesta.usuario.rol;

        if (rol === 'ADMIN') {
          this.router.navigateByUrl('/admin/dashboard');
        } else if (rol === 'OPERADOR') {
          this.router.navigateByUrl('/operator/returns');
        } else {
          this.router.navigateByUrl('/client/dashboard');
        }
      },
      error: err => {
        this.cargando = false;
        this.error = err.status === 401 || err.status === 403
          ? 'Correo o contraseña incorrectos.'
          : 'No se pudo iniciar sesión. Revisa la conexión con el backend.';
      }
    });
  }
}
