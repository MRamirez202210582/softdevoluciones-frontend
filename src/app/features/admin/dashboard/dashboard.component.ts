
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { DevolucionService } from '../../../core/services/devolucion.service';

import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboard implements OnInit {

  private devolucionService = inject(DevolucionService);

  devoluciones: Devolucion[] = [];

  total = 0;
  cargando = false;
  error = '';

  readonly tamanioPagina = 50;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.error = '';

    this.devolucionService.listarTodas(0, this.tamanioPagina).subscribe({
      next: pagina => {
        this.devoluciones = pagina.content ?? [];
        this.total = pagina.totalElements ?? 0;
        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.message ??
          'No se pudo cargar el panel administrativo.';
        this.cargando = false;
      }
    });
  }

  contar(estado: EstadoDevolucion): number {
    return this.devoluciones.filter(
      devolucion => devolucion.estado === estado
    ).length;
  }

  get totalImporte(): number {
    return this.devoluciones.reduce(
      (acumulado, devolucion) =>
        acumulado + Number(devolucion.importe ?? 0),
      0
    );
  }

  get solicitudesPendientes(): number {
    return this.contar('SOLICITADA') +
      this.contar('EN_REVISION');
  }

  get solicitudesFinalizadas(): number {
    return this.contar('COMPLETADA') +
      this.contar('RECHAZADA');
  }

  get porcentajeFinalizadas(): number {
    if (this.devoluciones.length === 0) {
      return 0;
    }

    return Math.round(
      (this.solicitudesFinalizadas / this.devoluciones.length) * 100
    );
  }
}
