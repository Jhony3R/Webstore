import { Routes } from '@angular/router';

export const CAJA_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./caja-list/caja-list.component').then(m => m.CajaListComponent) },
  { path: 'apertura', loadComponent: () => import('./caja-apertura/caja-apertura.component').then(m => m.CajaAperturaComponent) },
  { path: 'cierre/:id', loadComponent: () => import('./caja-cierre/caja-cierre.component').then(m => m.CajaCierreComponent) },
];
