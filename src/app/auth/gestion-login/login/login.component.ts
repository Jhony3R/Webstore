import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  hide = true;

  private loginService = inject(LoginService);
  private router = inject(Router);

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  login() {
    const cleanUsername = this.username.trim();
    const cleanPassword = this.password.trim();

    if (!cleanUsername || !cleanPassword) {
      this.showToast('Por favor ingresa usuario y contraseña', 'error');
      return;
    }

    this.isLoading = true;

    this.loginService.login(cleanUsername, cleanPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('¡Bienvenido!', 'success');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);

        const errorCode = error?.error?.error;

        if (errorCode === 'USER_DISABLED') {
          Swal.fire({
            icon: 'warning',
            title: 'Usuario deshabilitado',
            text: 'Tu cuenta se encuentra deshabilitada. Contacta al administrador.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#E8935B',
            heightAuto: false,
          });
        } else if (errorCode === 'INVALID_CREDENTIALS' || error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: 'Usuario o contraseña incorrectos',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#1F4B3F',
            heightAuto: false,
          });
        } else if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Sin conexión',
            text: 'No se pudo contactar al servidor. Verifica tu conexión.',
            confirmButtonText: 'Cerrar',
            heightAuto: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de inicio de sesión',
            text: 'Ocurrió un problema, intenta nuevamente',
            confirmButtonText: 'Cerrar',
            heightAuto: false,
          });
        }
      },
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
}
