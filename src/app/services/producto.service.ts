import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../model/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.HOST}/api/producto`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  findById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  save(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  update(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  reactivar(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/reactivar`, {});
  }
}
