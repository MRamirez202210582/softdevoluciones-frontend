
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { DevolucionService } from '../../../core/services/devolucion.service';
import { Devolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-admin-returns',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './returns.component.html',
  styleUrl: './returns.component.css'
})
export class AdminReturns implements OnInit {
  private devolucionService = inject(DevolucionService);

  devoluciones: Devolucion[] = [];
  cargando = false;
  error = '';
  total = 0;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.devolucionService.listarTodas(0, 50).subscribe({
      next: pagina => {
        this.devoluciones = pagina.content ?? [];
        this.total = pagina.totalElements ?? 0;
        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.message ??
          'No se pudieron cargar las devoluciones.';
        this.cargando = false;
      }
    });
  }
}
