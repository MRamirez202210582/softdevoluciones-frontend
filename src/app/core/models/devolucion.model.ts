export type EstadoDevolucion =
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'COMPLETADA';

export type MotivoDevolucion =
  | 'PRODUCTO_DEFECTUOSO'
  | 'PRODUCTO_INCORRECTO'
  | 'PRODUCTO_DANADO'
  | 'NO_CUMPLE_EXPECTATIVAS'
  | 'OTRO';

export interface DetalleDevolucion {
  id: number;
  detalleCompraId: number;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}

export interface Devolucion {
  id: number;
  compraId: number;
  usuarioId: number;
  fechaSolicitud: string;
  estado: EstadoDevolucion;
  motivo: MotivoDevolucion;
  comentario: string;
  observacionOperador: string;
  importe: number;
  detalles: DetalleDevolucion[];
}

export interface CrearDevolucionRequest {
  compraId: number;
  motivo: MotivoDevolucion;
  comentario: string;
  detalles: {
    detalleCompraId: number;
    cantidad: number;
  }[];
}

export interface Pagina<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
