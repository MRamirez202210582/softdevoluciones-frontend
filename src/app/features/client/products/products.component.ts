
import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductoService } from '../../../core/services/producto.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class Products implements OnInit {

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  productos: Producto[] = [];
  busqueda = '';
  cargando = true;
  procesandoId: number | null = null;
  error = '';
  mensaje = '';

  get productosFiltrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      (p.descripcion || '').toLowerCase().includes(texto)
    );
  }

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: productos => {
        this.productos = productos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    if (this.procesandoId !== null || producto.stock <= 0) {
      return;
    }

    this.procesandoId = producto.id;
    this.error = '';
    this.mensaje = '';

    this.carritoService.agregarProducto({
      productoId: producto.id,
      cantidad: 1
    })
      .pipe(finalize(() => this.procesandoId = null))
      .subscribe({
        next: () => {
          this.mensaje = `${producto.nombre} agregado al carrito.`;
        },
        error: err => {
          this.error = err.error?.message ||
            'No se pudo agregar el producto al carrito.';
        }
      });
  }
}
