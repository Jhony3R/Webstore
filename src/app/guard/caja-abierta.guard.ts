import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { CajaService } from '../services/caja.service';

export const cajaAbiertaGuard: CanActivateFn = () => {
  const cajaService = inject(CajaService);
  const router = inject(Router);

  const bloquear = () => {
    Swal.fire({
      icon: 'warning',
      title: 'No tienes una caja abierta',
      text: 'Debes aperturar caja antes de registrar ventas.',
      confirmButtonText: 'Ir a caja',
      confirmButtonColor: '#7C2D3B',
      heightAuto: false,
    });
    return router.createUrlTree(['/admin/caja']);
  };

  return cajaService.getCajaAbierta().pipe(
    map((caja) => (caja ? true : bloquear())),
    catchError(() => of(bloquear()))
  );
};
