import { Routes } from '@angular/router';
import { cajaAbiertaGuard } from '../../guard/caja-abierta.guard';

export const VENTAS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [cajaAbiertaGuard],
    loadComponent: () =>
      import('./venta-form/venta-form.component').then((m) => m.VentaFormComponent),
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./ventas-list/ventas-list.component').then((m) => m.VentasListComponent),
  },
];
