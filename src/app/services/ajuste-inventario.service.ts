import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';
import { AjusteInventario } from '../model/ajuste-invetario';

@Injectable({
  providedIn: 'root'
})
export class AjusteInventarioService extends GenericService<AjusteInventario>{
  private ajusteInventarioChange: Subject<AjusteInventario[]> = new Subject<AjusteInventario[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/ajuste-inventario`);
  }

  setAjusteInventarioChange(data: AjusteInventario[]) {
    this.ajusteInventarioChange.next(data);
  }

  getAjusteInventarioChange(){
    return this.ajusteInventarioChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
