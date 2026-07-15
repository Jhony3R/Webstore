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
  // {
  //   path: 'admin',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
  //   children: [
  //     { path: '', redirectTo: 'home', pathMatch: 'full' },
  //     { path: 'home', loadComponent: () => import('./pages/gestion-home/gestion-home.component').then(m => m.GestionHomeComponent) },
  //   ],
  // },
  // {
  //   path: 'usuarios',
  //   canActivate: [roleGuard(['ADMINISTRADOR'])],
  //   loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
  // },

  { path: '**', redirectTo: 'login' },
];
