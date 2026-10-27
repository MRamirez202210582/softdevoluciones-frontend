
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

import {environment} from "../../enviroments/environment";

import {
  Carrito,
  AgregarCarritoRequest
} from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/carrito`;

  carritoActual = signal<Carrito | null>(null);

  obtenerCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(this.apiUrl).pipe(
      tap(carrito => this.carritoActual.set(carrito))
    );
  }


  agregarProducto(request: AgregarCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(this.apiUrl, request).pipe(
      tap(carrito => this.carritoActual.set(carrito))
    );
  }

  actualizarCantidad(
    productoId: number,
    cantidad: number
  ): Observable<Carrito> {
    return this.http.put<Carrito>(this.apiUrl, {
      productoId,
      cantidad
    }).pipe(
      tap(carrito => this.carritoActual.set(carrito))
    );
  }

  eliminarProducto(productoId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(
      `${this.apiUrl}/producto/${productoId}`
    ).pipe(
      tap(carrito => this.carritoActual.set(carrito))
    );
  }

  vaciarCarrito(): Observable<Carrito> {
    return this.http.delete<Carrito>(this.apiUrl).pipe(
      tap(carrito => this.carritoActual.set(carrito))
    );
  }


  limpiarEstadoLocal(): void {
    this.carritoActual.set(null);
  }
}
