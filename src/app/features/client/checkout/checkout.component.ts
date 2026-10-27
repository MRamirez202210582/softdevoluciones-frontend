
import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CarritoService } from '../../../core/services/carrito.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Carrito } from '../../../core/models/carrito.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class Checkout implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);

  carrito: Carrito | null = null;

  cargando = true;
  procesando = false;
  error = '';

  formulario = this.fb.nonNullable.group({
    clienteNombre: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    celular: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{9}$/)
    ]],
    direccion: ['', [
      Validators.required,
      Validators.minLength(5)
    ]]
  });

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

        if (!carrito.productos?.length) {
          this.error = 'Tu carrito está vacío.';
        }
      },
      error: () => {
        this.error = 'No se pudo cargar el carrito.';
        this.cargando = false;
      }
    });
  }

  confirmarCompra(): void {

    if (this.procesando) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (!this.carrito?.productos?.length) {
      this.error = 'Debes agregar productos antes de comprar.';
      return;
    }

    this.procesando = true;
    this.error = '';

    const datos = this.formulario.getRawValue();

    this.pedidoService.crearPedido({
      clienteNombre: datos.clienteNombre.trim(),
      celular: datos.celular.trim(),
      direccion: datos.direccion.trim()
    })
      .pipe(
        finalize(() => this.procesando = false)
      )
      .subscribe({
        next: pedido => {
          this.carritoService.limpiarEstadoLocal();

          this.router.navigate(
            ['/client/orders'],
            {
              state: {
                mensaje: `Pedido #${pedido.id} registrado correctamente.`
              }
            }
          );
        },
        error: err => {
          if (err.status === 401 || err.status === 403) {
            this.error =
              'No tienes autorización para registrar la compra. ' +
              'Verifica que hayas iniciado sesión como CLIENTE.';
            return;
          }

          this.error =
            err.error?.message ||
            err.error?.detail ||
            'No se pudo registrar la compra. Inténtalo nuevamente.';
        }
      });
  }

  get nombreInvalido(): boolean {
    const control = this.formulario.controls.clienteNombre;
    return control.invalid && (control.touched || control.dirty);
  }

  get celularInvalido(): boolean {
    const control = this.formulario.controls.celular;
    return control.invalid && (control.touched || control.dirty);
  }

  get direccionInvalida(): boolean {
    const control = this.formulario.controls.direccion;
    return control.invalid && (control.touched || control.dirty);
  }
}

