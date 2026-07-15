import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtResponse } from '../model/jwt/jwt-response';
import { JwtRequest } from '../model/jwt/jwt-request';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url: string = `${environment.HOST}/api/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string) {
    const body: JwtRequest = { username, password };
    return this.http.post<JwtResponse>(this.url, body).pipe(
      tap((res) => {
        sessionStorage.setItem(environment.TOKEN_NAME, res.access_token);
        sessionStorage.setItem('rol', res.rol);
        sessionStorage.setItem('username', username);
      }),
    );
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  isLogged(): boolean {
    return sessionStorage.getItem(environment.TOKEN_NAME) != null;
  }

  getRol(): string | null {
    return sessionStorage.getItem('rol');
  }
}
