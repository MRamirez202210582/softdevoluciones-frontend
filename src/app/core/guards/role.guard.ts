import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Rol } from '../models/usuario.model';

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const rol = auth.usuario()?.rol;
  const roles = route.data['roles'] as Rol[];

  return rol && roles.includes(rol)
    ? true
    : router.createUrlTree(['/login']);
};
