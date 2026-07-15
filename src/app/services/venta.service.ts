import { Injectable } from '@angular/core';
import { Venta } from '../model/venta';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta>{
  private ventaChange: Subject<Venta[]> = new Subject<Venta[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
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
}
