
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminUsuarioService } from '../../../core/services/admin-usuario.service';

import {
  AdminUsuario,
  RolUsuario
} from '../../../core/models/admin-usuario.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class AdminUsers implements OnInit {

  private usuarioService = inject(AdminUsuarioService);

  usuarios: AdminUsuario[] = [];

  cargando = false;
  error = '';
  mensaje = '';

  usuarioActualizando: number | null = null;

  readonly roles: RolUsuario[] = [
    'CLIENTE',
    'OPERADOR',
    'ADMIN'
  ];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.usuarioService.listarUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.message ||
          'No se pudieron cargar los usuarios.';
        this.cargando = false;
      }
    });
  }

  cambiarRol(
    usuario: AdminUsuario,
    nuevoRol: RolUsuario
  ): void {

    if (usuario.rol === nuevoRol) {
      return;
    }

    const confirmado = window.confirm(
      `¿Deseas cambiar el rol de ${usuario.nombre} ` +
      `de ${usuario.rol} a ${nuevoRol}?`
    );

    if (!confirmado) {
      return;
    }

    this.usuarioActualizando = usuario.id;
    this.error = '';
    this.mensaje = '';

    this.usuarioService
      .actualizarRol(usuario.id, nuevoRol)
      .subscribe({
        next: usuarioActualizado => {

          this.usuarios = this.usuarios.map(u =>
            u.id === usuarioActualizado.id
              ? usuarioActualizado
              : u
          );

          this.usuarioActualizando = null;

          this.mensaje =
            `El rol de ${usuarioActualizado.nombre} ` +
            `se actualizó a ${usuarioActualizado.rol}.`;
        },
        error: err => {
          this.usuarioActualizando = null;

          this.error = err.error?.message ||
            'No se pudo actualizar el rol del usuario.';
        }
      });
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  contarPorRol(rol: RolUsuario): number {
    return this.usuarios.filter(
      usuario => usuario.rol === rol
    ).length;
  }

  trackUsuario(
    index: number,
    usuario: AdminUsuario
  ): number {
    return usuario.id;
  }
}
