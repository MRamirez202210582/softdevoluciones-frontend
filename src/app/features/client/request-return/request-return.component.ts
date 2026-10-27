import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { DevolucionService } from '../../../core/services/devolucion.service';
import { Pedido } from '../../../core/models/pedido.model';
import { MotivoDevolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-request-return',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-return.component.html',
  styleUrl: './request-return.component.css'
})
export class RequestReturn implements OnInit {
  private pedidoService = inject(PedidoService);
  private devolucionService = inject(DevolucionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pedidos: Pedido[] = [];
  pedidoId = 0;
  indiceDetalle = -1;
  cantidad = 1;
  motivo: MotivoDevolucion = 'PRODUCTO_DEFECTUOSO';
  comentario = '';
  error = '';
  cargando = false;
  enviando = false;

  get pedidoSeleccionado(): Pedido | undefined {
    return this.pedidos.find(p => p.id === Number(this.pedidoId));
  }

  get detalleSeleccionado() {
    return this.pedidoSeleccionado?.detalles[this.indiceDetalle];
  }

  ngOnInit(): void {
    this.pedidoId = Number(
      this.route.snapshot.queryParamMap.get('pedidoId') || 0
    );

    this.cargando = true;

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

  cambiarPedido(): void {
    this.indiceDetalle = -1;
    this.cantidad = 1;
    this.error = '';
  }

  solicitar(): void {
    this.error = '';

    const pedido = this.pedidoSeleccionado;
    const detalle = this.detalleSeleccionado;

    if (!pedido || !detalle) {
      this.error = 'Selecciona un pedido y un producto.';
      return;
    }

    if (
      !Number.isInteger(this.cantidad) ||
      this.cantidad < 1 ||
      this.cantidad > detalle.cantidad
    ) {
      this.error = 'La cantidad solicitada no es válida.';
      return;
    }

    if (!this.comentario.trim()) {
      this.error = 'Describe el motivo de la devolución.';
      return;
    }

    if (detalle.detalleCompraId == null) {
      this.error = 'El pedido no contiene detalleCompraId. Revisa el DTO del backend.';
      return;
    }

    this.enviando = true;

    this.devolucionService.solicitar({
      compraId: pedido.id,
      motivo: this.motivo,
      comentario: this.comentario.trim(),
      detalles: [{
        detalleCompraId: detalle.detalleCompraId,
        cantidad: this.cantidad
      }]
    }).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigateByUrl('/client/returns');
      },
      error: err => {
        this.enviando = false;
        this.error = err.error?.message ||
          'No se pudo registrar la solicitud de devolución.';
      }
    });
  }
}
