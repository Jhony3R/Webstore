import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/gestion-login/login/login.component').then(m => m.LoginComponent),
  },

  // {
  //   path: 'crear-cuenta',
  //   loadComponent: () => import('./auth/crear-cuenta/crear-cuenta.component').then(m => m.CrearCuentaComponent),
  // },
  // {
  //   path: 'reset-password',
  //   loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  // },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/gestion-home/gestion-home.component').then(m => m.GestionHomeComponent) },
      { path: 'productos', loadChildren: () => import('./pages/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES) },
      { path: 'caja', loadChildren: () => import('./pages/caja/caja.routes').then(m => m.CAJA_ROUTES) },
      { path: 'clientes', loadChildren: () => import('./pages/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES) },
      { path: 'proveedores', loadChildren: () => import('./pages/proveedores/proveedores.routes').then(m => m.PROVEEDORES_ROUTES) },
      { path: 'ventas', loadChildren: () => import('./pages/ventas/ventas.routes').then(m => m.VENTAS_ROUTES) },
      { path: 'compras', loadChildren: () => import('./pages/compras/compras.routes').then(m => m.COMPRAS_ROUTES) },
      {
        path: 'ajuste-inventario',
        canActivate: [roleGuard(['ADMINISTRADOR'])],
        loadChildren: () => import('./pages/ajuste-inventario/ajuste-inventario.routes').then(m => m.AJUSTE_INVENTARIO_ROUTES)
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard(['ADMINISTRADOR'])],
        loadChildren: () => import('./pages/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
