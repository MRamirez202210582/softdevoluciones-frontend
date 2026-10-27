import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DevolucionService } from '../../../core/services/devolucion.service';
import { Devolucion } from '../../../core/models/devolucion.model';

@Component({
  selector: 'app-my-returns',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './my-return.component.html',
  styleUrl: './my-return.component.css'
})
export class MyReturns implements OnInit {
  private devolucionService = inject(DevolucionService);

  devoluciones: Devolucion[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.devolucionService.misDevoluciones().subscribe({
      next: devoluciones => {
        this.devoluciones = devoluciones;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus devoluciones.';
        this.cargando = false;
      }
    });
  }
}
