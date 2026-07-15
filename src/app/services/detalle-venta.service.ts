import { Injectable } from '@angular/core';
import { DetalleVenta } from '../model/detalle-venta';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService extends GenericService<DetalleVenta>{
  private detalleVentaChange: Subject<DetalleVenta[]> = new Subject<DetalleVenta[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/detalle-venta`);
  }

  setDetalleVentaChange(data: DetalleVenta[]) {
    this.detalleVentaChange.next(data);
  }

  getDetalleVentaChange(){
    return this.detalleVentaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
