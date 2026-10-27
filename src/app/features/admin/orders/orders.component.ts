
import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../enviroments/environment";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class AdminOrders implements OnInit {
  private http = inject(HttpClient);

  pedidos: Pedido[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Pedido[]>(`${environment.apiUrl}/pedidos`)
      .subscribe({
        next: pedidos => {
          this.pedidos = pedidos;
          this.cargando = false;
        },
        error: err => {
          this.error = err.error?.message ||
            'No se pudieron cargar los pedidos.';
          this.cargando = false;
        }
      });
  }
}
