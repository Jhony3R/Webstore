import { Routes } from '@angular/router';

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./productos-list/productos-list.component').then((m) => m.ProductosListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./productos-form/productos-form.component').then((m) => m.ProductosFormComponent),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./productos-form/productos-form.component').then((m) => m.ProductosFormComponent),
  },
];
