import { Injectable } from '@angular/core';
import { Categoria } from '../model/categoria';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria>{
  private categoriaChange: Subject<Categoria[]> = new Subject<Categoria[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/categoria`);
  }

  setCategoriaChange(data: Categoria[]) {
    this.categoriaChange.next(data);
  }

  getCategoriaChange(){
    return this.categoriaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
