import { Injectable } from '@angular/core';
import { MovimientoCaja } from '../model/movimiento-caja';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientoCajaService extends GenericService<MovimientoCaja>{
  private movimientoCajaChange: Subject<MovimientoCaja[]> = new Subject<MovimientoCaja[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/movimiento-caja`);
  }

  setMovimientoCajaChange(data: MovimientoCaja[]) {
    this.movimientoCajaChange.next(data);
  }

  getMovimientoCajaChange(){
    return this.movimientoCajaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
