import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLogged()) {
    return true;
  }

  Swal.fire({
    icon: 'warning',
    title: 'Sesión requerida',
    text: 'Debes iniciar sesión para acceder a esta sección.',
    confirmButtonText: 'Ir al login',
    confirmButtonColor: '#1F4B3F',
    heightAuto: false,
  });

  router.navigate(['/login']);
  return false;
};
