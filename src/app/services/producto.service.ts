import { Injectable } from '@angular/core';
import { Producto } from '../model/producto';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends GenericService<Producto>{
  private productoChange: Subject<Producto[]> = new Subject<Producto[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/producto`);
  }

  setBancoChange(data: Producto[]) {
    this.productoChange.next(data);
  }

  getBancoChange(){
    return this.productoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
