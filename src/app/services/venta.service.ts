import { Injectable } from '@angular/core';
import { Venta } from '../model/venta';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';

export interface DetalleVentaRequest {
  idProducto: number;
  cantidad: number;
}

export interface VentaRequest {
  idCliente: number | null;
  metodoPago: string;
  tipoDescuento?: string;
  valorDescuentoInput?: number;
  detalles: DetalleVentaRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta>{
  private ventaChange: Subject<Venta[]> = new Subject<Venta[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.HOST}/api/venta`);
  }

  setVentaChange(data: Venta[]) {
    this.ventaChange.next(data);
  }

  getVentaChange(){
    return this.ventaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  registrarVenta(request: VentaRequest): Observable<Venta> {
    return this.http.post<Venta>(`${environment.HOST}/api/venta/registrar`, request);
  }

  anularVenta(id: number, motivo: string): Observable<Venta> {
    return this.http.put<Venta>(`${environment.HOST}/api/venta/${id}/anular`, { motivo });
  }

  descargarComprobante(id: number): Observable<Blob> {
    return this.http.get(`${environment.HOST}/api/venta/${id}/comprobante`, {
      responseType: 'blob',
    });
  }
}
