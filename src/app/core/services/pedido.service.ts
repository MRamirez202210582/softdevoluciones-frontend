
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Pedido } from '../models/pedido.model';
import {environment} from "../../enviroments/environment";

export interface CrearPedidoRequest {
  clienteNombre: string;
  celular: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/pedidos`;

  misPedidos() {
    return this.http.get<Pedido[]>(
      `${this.apiUrl}/mis-pedidos`
    );
  }

  obtenerPorId(id: number) {
    return this.http.get<Pedido>(
      `${this.apiUrl}/${id}`
    );
  }

  crearPedido(request: CrearPedidoRequest) {
    return this.http.post<Pedido>(
      this.apiUrl,
      request
    );
  }
}
