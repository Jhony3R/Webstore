import { Routes } from '@angular/router';

export const CATEGORIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./categorias-list/categorias-list.component').then(m => m.CategoriasListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./categorias-form/categorias-form.component').then(m => m.CategoriasFormComponent),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./categorias-form/categorias-form.component').then(m => m.CategoriasFormComponent),
  },
];
