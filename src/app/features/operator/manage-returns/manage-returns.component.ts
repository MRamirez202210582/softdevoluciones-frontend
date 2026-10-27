import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { DevolucionService } from '../../../core/services/devolucion.service';

import {
  Devolucion,
  EstadoDevolucion
} from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-manage-returns',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './manage-returns.component.html',
  styleUrl: './manage-returns.component.css'
})
export class ManageReturns implements OnInit {

  private devolucionService = inject(DevolucionService);

  devoluciones: Devolucion[] = [];
  observaciones: Record<number, string> = {};

  cargando = false;
  procesandoId: number | null = null;

  error = '';
  mensaje = '';

  busqueda = '';
  filtroEstado = '';
  filtroMotivo = '';
  filtroDesde = '';
  filtroHasta = '';

  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;

  readonly tamanioPagina = 10;

  readonly estados: EstadoDevolucion[] = [
    'SOLICITADA',
    'EN_REVISION',
    'APROBADA',
    'RECHAZADA',
    'COMPLETADA'
  ];

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(): void {
    this.cargando = true;
    this.error = '';

    this.devolucionService.listarTodas().subscribe({
      next: pagina => {

        this.devoluciones = pagina.content ?? [];

        this.totalElementos = pagina.totalElements ??
          this.devoluciones.length;

        this.totalPaginas = pagina.totalPages ?? 1;

        this.paginaActual = pagina.number ?? 0;

        for (const devolucion of this.devoluciones) {
          this.observaciones[devolucion.id] =
            devolucion.observacionOperador ?? '';
        }

        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.message ??
          'No se pudieron cargar las devoluciones.';

        this.cargando = false;
      }
    });
  }

  get devolucionesFiltradas(): Devolucion[] {

    return this.devoluciones.filter(devolucion => {

      const busqueda = this.busqueda.trim().toLowerCase();

      const coincideBusqueda =
        !busqueda ||
        devolucion.id.toString().includes(busqueda) ||
        devolucion.compraId.toString().includes(busqueda) ||
        devolucion.usuarioId.toString().includes(busqueda);

      const coincideEstado =
        !this.filtroEstado ||
        devolucion.estado === this.filtroEstado;

      const coincideMotivo =
        !this.filtroMotivo ||
        devolucion.motivo === this.filtroMotivo;

      const fecha = devolucion.fechaSolicitud
        ? devolucion.fechaSolicitud.substring(0, 10)
        : '';

      const coincideDesde =
        !this.filtroDesde || fecha >= this.filtroDesde;

      const coincideHasta =
        !this.filtroHasta || fecha <= this.filtroHasta;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideMotivo &&
        coincideDesde &&
        coincideHasta
      );
    });
  }

  get motivosDisponibles(): string[] {

    return [
      ...new Set(
        this.devoluciones.map(d => d.motivo)
      )
    ].sort();
  }

  get solicitudesPendientes(): number {
    return this.devoluciones.filter(d =>
      d.estado === 'SOLICITADA'
    ).length;
  }

  get solicitudesEnRevision(): number {
    return this.devoluciones.filter(d =>
      d.estado === 'EN_REVISION'
    ).length;
  }

  get solicitudesAprobadas(): number {
    return this.devoluciones.filter(d =>
      d.estado === 'APROBADA'
    ).length;
  }

  get solicitudesCompletadas(): number {
    return this.devoluciones.filter(d =>
      d.estado === 'COMPLETADA'
    ).length;
  }

  get solicitudesRechazadas(): number {
    return this.devoluciones.filter(d =>
      d.estado === 'RECHAZADA'
    ).length;
  }

  puedeCambiarEstado(
    devolucion: Devolucion,
    nuevoEstado: EstadoDevolucion
  ): boolean {

    const estadoActual = devolucion.estado;

    switch (nuevoEstado) {

      case 'EN_REVISION':
        return estadoActual === 'SOLICITADA';

      case 'APROBADA':
      case 'RECHAZADA':
        return estadoActual === 'EN_REVISION';

      case 'COMPLETADA':
        return estadoActual === 'APROBADA';

      default:
        return false;
    }
  }

  cambiarEstado(
    devolucion: Devolucion,
    nuevoEstado: EstadoDevolucion
  ): void {

    this.error = '';
    this.mensaje = '';

    if (!this.puedeCambiarEstado(devolucion, nuevoEstado)) {
      this.error = 'La transición de estado no está permitida.';
      return;
    }

    const observacion =
      (this.observaciones[devolucion.id] ?? '').trim();

    if (nuevoEstado === 'RECHAZADA' && !observacion) {
      this.error =
        'Debes escribir una observación para rechazar la devolución.';
      return;
    }

    const confirmado = window.confirm(
      `¿Confirmas cambiar la solicitud #${devolucion.id} a ${this.formatearEstado(nuevoEstado)}?`
    );

    if (!confirmado) {
      return;
    }

    this.procesandoId = devolucion.id;

    this.devolucionService.cambiarEstado(
      devolucion.id,
      nuevoEstado,
      observacion
    ).subscribe({

      next: () => {

        this.procesandoId = null;

        this.cargarDevoluciones();

        this.mensaje =
          `La solicitud #${devolucion.id} cambió a ${this.formatearEstado(nuevoEstado)}.`;
      },

      error: err => {

        this.procesandoId = null;

        this.error = err.error?.message ??
          'No se pudo actualizar el estado de la devolución.';
      }
    });
  }

  formatearEstado(estado: string): string {
    return estado
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/^./, letra => letra.toUpperCase());
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroEstado = '';
    this.filtroMotivo = '';
    this.filtroDesde = '';
    this.filtroHasta = '';
  }

  actualizar(): void {
    this.mensaje = '';
    this.cargarDevoluciones();
  }
}
