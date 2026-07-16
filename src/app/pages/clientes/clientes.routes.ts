import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clientes-list/cliente-list.component').then((m) => m.ClienteListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./clientes-form/cliente-form.component').then((m) => m.ClienteFormComponent),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./clientes-form/cliente-form.component').then((m) => m.ClienteFormComponent),
  },
];
