import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) { }

  findAll():Observable<T[]>{
    return this.http.get<T[]>(this.url)
  }

  findById(id: number):Observable<T>{
    return this.http.get<T>(`${this.url}/${id}`)
  }

  save(t: T): Observable<T> {
      return this.http.post<T>(this.url, t);
  }

  update(id: number, t: T): Observable<T> {
      return this.http.put<T>(`${this.url}/${id}`, t);
  }

  delete(id: number, forzar: boolean = false) {
    return this.http.delete(`${this.url}/${id}?forzar=${forzar}`);
  }

  listPageable(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.url}/pageable?page=${page}&size=${size}`);
  }

}
