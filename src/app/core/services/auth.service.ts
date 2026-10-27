import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import {environment} from "../../enviroments/environment";
import {
  Usuario,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  usuario = signal<Usuario | null>(this.leerUsuario());

  private leerUsuario(): Usuario | null {
    try {
      return JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch {
      return null;
    }
  }

  login(datos: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      datos
    ).pipe(
      tap(respuesta => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem(
          'usuario',
          JSON.stringify(respuesta.usuario)
        );
        this.usuario.set(respuesta.usuario);
      })
    );
  }

  register(datos: RegisterRequest) {
    return this.http.post<Usuario>(
      `${environment.apiUrl}/auth/register`,
      datos
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario.set(null);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token') && !!this.usuario();
  }
}
