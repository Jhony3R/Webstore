import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('./usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./usuarios-form/usuarios-form.component').then(m => m.UsuariosFormComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./usuarios-form/usuarios-form.component').then(m => m.UsuariosFormComponent)
  },
];
