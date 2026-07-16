import { Routes } from '@angular/router';

export const PROVEEDORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./proveedores-list/proveedor-list.component').then((m) => m.ProveedorListComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./proveedores-form/proveedor-form.component').then((m) => m.ProveedorFormComponent),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./proveedores-form/proveedor-form.component').then((m) => m.ProveedorFormComponent),
  },
];
