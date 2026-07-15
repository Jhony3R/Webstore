import { Injectable } from '@angular/core';
import { Caja } from '../model/caja';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService extends GenericService<Caja>{
  private cajaChange: Subject<Caja[]> = new Subject<Caja[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/caja`);
  }

  setCajaChange(data: Caja[]) {
    this.cajaChange.next(data);
  }

  getCajaChange(){
    return this.cajaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
