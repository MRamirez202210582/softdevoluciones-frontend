import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrders implements OnInit {
  private pedidoService = inject(PedidoService);

  pedidos: Pedido[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.pedidoService.misPedidos().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus pedidos.';
        this.cargando = false;
      }
    });
  }
}
