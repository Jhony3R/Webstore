import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

export function roleGuard(rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (!loginService.isLogged()) {
      router.navigate(['/login']);
      return false;
    }

    const rol = loginService.getRol();

    if (rol && rolesPermitidos.includes(rol)) {
      return true;
    }

    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta sección.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#1F4B3F',
      heightAuto: false,
    });

    router.navigate(['/admin']);
    return false;
  };
}
