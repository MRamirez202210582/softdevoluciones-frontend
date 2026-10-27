import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {environment} from "../../enviroments/environment";

import {
  CrearDevolucionRequest,
  Devolucion,
  EstadoDevolucion,
  Pagina
} from '../models/devolucion.model';

@Injectable({ providedIn: 'root' })
export class DevolucionService {
  private http = inject(HttpClient);

  private url = `${environment.apiUrl}/devoluciones`;
  private admin = `${environment.apiUrl}/admin/devoluciones`;

  solicitar(datos: CrearDevolucionRequest) {
    return this.http.post<Devolucion>(this.url, datos);
  }

  misDevoluciones() {
    return this.http.get<Devolucion[]>(
      `${this.url}/mis-devoluciones`
    );
  }

  listarTodas(pagina = 0, tamanio = 50) {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio);

    return this.http.get<Pagina<Devolucion>>(
      this.admin,
      { params }
    );
  }

  cambiarEstado(
    id: number,
    nuevoEstado: EstadoDevolucion,
    observacionOperador = ''
  ) {
    return this.http.patch<Devolucion>(
      `${this.admin}/${id}/estado`,
      {
        nuevoEstado,
        observacionOperador
      }
    );
  }
}
