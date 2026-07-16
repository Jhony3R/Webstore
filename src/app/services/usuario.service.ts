import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{
  private usuarioChange: Subject<Usuario[]> = new Subject<Usuario[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/usuario`);
  }

  setUsuarioChange(data: Usuario[]) {
    this.usuarioChange.next(data);
  }

  getUsuarioChange(){
    return this.usuarioChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  findByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/username/${username}`);
  }
}
