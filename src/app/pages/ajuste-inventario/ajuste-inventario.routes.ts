import { Routes } from '@angular/router';

export const AJUSTE_INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ajuste-inventario-list/ajuste-inventario-list.component').then(
        (m) => m.AjusteInventarioListComponent
      ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./ajuste-inventario-form/ajuste-inventario-form.component').then(
        (m) => m.AjusteInventarioFormComponent
      ),
  },
];
