import { Injectable } from '@angular/core';
import { DetalleCompra } from '../model/detalle-compra';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraService extends GenericService<DetalleCompra>{
  private detalleCompraChange: Subject<DetalleCompra[]> = new Subject<DetalleCompra[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/detalle-compra`);
  }

  setDetalleCompraChange(data: DetalleCompra[]) {
    this.detalleCompraChange.next(data);
  }

  getDetalleCompraChange(){
    return this.detalleCompraChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
