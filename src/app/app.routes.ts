
import { Routes } from '@angular/router';

// Autenticación
import { Login } from './features/auth/login/login.component';
import { Register } from './features/auth/register/register.component';

// Cliente
import { ClientDashboard } from './features/client/dashboard/dashboard.component';
import { Products } from './features/client/products/products.component';
import { Cart } from './features/client/cart/cart.component';
import { Checkout } from './features/client/checkout/checkout.component';
import { MyOrders } from './features/client/my-orders/my-orders.component';
import { RequestReturn } from './features/client/request-return/request-return.component';
import { MyReturns } from './features/client/my-return/my-return.component';

// Operador
import { ManageReturns } from './features/operator/manage-returns/manage-returns.component';

// Administrador
import { AdminDashboard } from './features/admin/dashboard/dashboard.component';
import { AdminReturns } from './features/admin/returns/returns.component';
import { AdminUsers } from './features/admin/users/users.component';
import { AdminOrders } from './features/admin/orders/orders.component';

// Layout
import { Layout } from './shared/components/layout/layout.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // Página principal
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Autenticación
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  // Rutas privadas
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [

      // ========================================
      // CLIENTE
      // ========================================

      {
        path: 'client/dashboard',
        component: ClientDashboard,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/products',
        component: Products,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/cart',
        component: Cart,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/checkout',
        component: Checkout,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/orders',
        component: MyOrders,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/returns/new',
        component: RequestReturn,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'client/returns',
        component: MyReturns,
        canActivate: [roleGuard],
        data: { roles: ['CLIENTE'] }
      },

      // ========================================
      // OPERADOR
      // ========================================

      {
        path: 'operator/returns',
        component: ManageReturns,
        canActivate: [roleGuard],
        data: { roles: ['OPERADOR', 'ADMIN'] }
      },

      // ========================================
      // ADMINISTRADOR
      // ========================================

      // Panel principal
      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // Supervisar devoluciones
      {
        path: 'admin/returns',
        component: AdminReturns,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // Gestión de usuarios
      {
        path: 'admin/users',
        component: AdminUsers,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // Consulta global de pedidos
      {
        path: 'admin/orders',
        component: AdminOrders,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      }

    ]
  },

  // Ruta inexistente
  {
    path: '**',
    redirectTo: 'login'
  }

];
