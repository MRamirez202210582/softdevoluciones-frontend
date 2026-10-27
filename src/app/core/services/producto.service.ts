import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Producto } from '../models/producto.model';
import {environment} from "../../enviroments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/productos`;

  // Obtener todos los productos
  listar() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Obtener un producto por su ID
  obtenerPorId(id: number) {
    return this.http.get<Producto>(
      `${this.apiUrl}/${id}`
    );
  }
}
