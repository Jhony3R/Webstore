import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY, Observable, retry, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private isShowingSessionExpired = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(retry(environment.RETRY))
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            if (event.body && event.body.error === true && event.body.errorMessage) {
              throw new Error(event.body.errorMessage);
            }
          }
        }),
      )
      .pipe(
        catchError((err) => {
          if (req.url.includes('login') || req.url.includes('auth')) {
            return throwError(() => err);
          }
          if (req.url.includes('verify-code') || req.url.includes('verificar')) {
            return throwError(() => err);
          }
          if (req.url.includes('whatsapp') || req.url.includes('wsp') || req.url.includes('chat')) {
            return throwError(() => err);
          }

          if (err.status === 400) {
            this.showToast(err.error?.message || 'Solicitud inválida', 'error');
          } else if (err.status === 401) {
            this.handleUnauthorized();
          } else if (err.status === 404) {
            this.showToast('No existe el recurso', 'error');
          } else if (err.status === 403) {
            this.showToast(err.error?.message || 'No tienes permisos para esta acción', 'error');
          } else if (err.status === 409) {
            return throwError(() => err);
          } else if (err.status === 500) {
            this.showToast(err.error?.message || 'Error del servidor', 'error');
          } else {
            this.showToast('Ocurrió un error inesperado', 'error');
          }

          return EMPTY;
        }),
      );
  }

  private handleUnauthorized(): void {
    if (this.isShowingSessionExpired) return;
    this.isShowingSessionExpired = true;
    sessionStorage.clear();

    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      confirmButtonText: 'Ir al inicio',
      confirmButtonColor: '#1F4B3F',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
    }).then(() => {
      this.isShowingSessionExpired = false;
      this.router.navigate(['/login']);
    });
  }

  private showToast(message: string, icon: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });
  }
}
