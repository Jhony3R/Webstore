import { Routes } from '@angular/router';

export const COMPRAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./compras-form/compras-form.component').then((m) => m.ComprasFormComponent),
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./compras-list/compras-list.component').then((m) => m.ComprasListComponent),
  },
];
