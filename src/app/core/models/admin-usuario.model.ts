
export type RolUsuario = 'CLIENTE' | 'OPERADOR' | 'ADMIN';

export interface AdminUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface ActualizarRolRequest {
  rol: RolUsuario;
}
