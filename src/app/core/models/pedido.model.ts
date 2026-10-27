export interface DetallePedido {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  detalleCompraId?: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  clienteNombre: string;
  celular: string;
  direccion: string;
  fecha: string;
  estado: string;
  total: number;
  detalles: DetallePedido[];
}
