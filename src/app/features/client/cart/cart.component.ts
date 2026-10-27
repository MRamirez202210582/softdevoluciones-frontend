
import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CarritoService } from '../../../core/services/carrito.service';
import { Carrito, CarritoItem } from '../../../core/models/carrito.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class Cart implements OnInit {

  private carritoService = inject(CarritoService);

  carrito: Carrito | null = null;
  cargando = true;
  procesando = false;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.cargando = true;
    this.error = '';

    this.carritoService.obtenerCarrito().subscribe({
      next: carrito => {
        this.carrito = carrito;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el carrito.';
        this.cargando = false;
      }
    });
  }

  cambiarCantidad(item: CarritoItem, cambio: number): void {
    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad < 1 || this.procesando) {
      return;
    }

    this.procesando = true;
    this.error = '';
    this.mensaje = '';

    this.carritoService
      .actualizarCantidad(item.productoId, nuevaCantidad)
      .pipe(finalize(() => this.procesando = false))
      .subscribe({
        next: carrito => this.carrito = carrito,
        error: err => {
          this.error = err.error?.message ||
            'No se pudo actualizar la cantidad.';
        }
      });
  }

  eliminarProducto(item: CarritoItem): void {
    if (this.procesando) {
      return;
    }

    this.procesando = true;
    this.error = '';

    this.carritoService
      .eliminarProducto(item.productoId)
      .pipe(finalize(() => this.procesando = false))
      .subscribe({
        next: carrito => {
          this.carrito = carrito;
          this.mensaje = 'Producto eliminado del carrito.';
        },
        error: () => {
          this.error = 'No se pudo eliminar el producto.';
        }
      });
  }

  vaciarCarrito(): void {
    if (this.procesando ||
      !this.carrito?.productos.length ||
      !window.confirm('¿Vaciar todo el carrito?')) {
      return;
    }

    this.procesando = true;
    this.error = '';

    this.carritoService.vaciarCarrito()
      .pipe(finalize(() => this.procesando = false))
      .subscribe({
        next: carrito => {
          this.carrito = carrito;
          this.mensaje = 'Carrito vaciado correctamente.';
        },
        error: () => {
          this.error = 'No se pudo vaciar el carrito.';
        }
      });
  }
}
