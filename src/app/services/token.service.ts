import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  saveToken(value: string): void {
    sessionStorage.setItem(environment.TOKEN_NAME, value);
  }

  getToken(): string | null {
    return sessionStorage.getItem(environment.TOKEN_NAME);
  }

  removeToken(): void {
    sessionStorage.removeItem(environment.TOKEN_NAME);
  }

  saveRol(rol: string): void {
    sessionStorage.setItem('rol', rol);
  }

  getRol(): string | null {
    return sessionStorage.getItem('rol');
  }

  removeRol(): void {
    sessionStorage.removeItem('rol');
  }
}
