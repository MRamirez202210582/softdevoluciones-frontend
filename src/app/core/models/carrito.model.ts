
export interface CarritoItem {
  productoId: number;
  nombre: string;
  imagenUrl: string | null;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id: number | null;
  usuarioId: number;
  productos: CarritoItem[];
  total: number;
}

export interface AgregarCarritoRequest {
  productoId: number;
  cantidad: number;
}
