
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment} from "../../enviroments/environment";

import {
  AdminUsuario,
  RolUsuario,
  ActualizarRolRequest
} from '../models/admin-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuarioService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/admin/usuarios`;

  listarUsuarios(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<AdminUsuario> {
    return this.http.get<AdminUsuario>(
      `${this.apiUrl}/${id}`
    );
  }

  actualizarRol(
    id: number,
    rol: RolUsuario
  ): Observable<AdminUsuario> {

    const body: ActualizarRolRequest = {
      rol
    };

    return this.http.patch<AdminUsuario>(
      `${this.apiUrl}/${id}/rol`,
      body
    );
  }
}
