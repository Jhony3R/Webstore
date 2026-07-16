import { Injectable } from '@angular/core';
import { Compra } from '../model/compra';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

export interface DetalleCompraRequest {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraRequest{
  numeroComprobante: string;
  fecha?: string;
  idProveedor: number;
  idUsuario: number | null;
  detalles: DetalleCompraRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class CompraService extends GenericService<Compra>{
  private compraChange: Subject<Compra[]> = new Subject<Compra[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/compra`);
  }

  setCompraChange(data: Compra[]) {
    this.compraChange.next(data);
  }

  getCompraChange(){
    return this.compraChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  registrarCompra(dto: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(`${environment.HOST}/api/compra/registrar`, dto);
  }
}
