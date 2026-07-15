import { Injectable } from '@angular/core';
import { Proveedor } from '../model/proveedor';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService extends GenericService<Proveedor>{
  private proveedorChange: Subject<Proveedor[]> = new Subject<Proveedor[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/proveedor`);
  }

  setProveedorChange(data: Proveedor[]) {
    this.proveedorChange.next(data);
  }

  getProveedorChange(){
    return this.proveedorChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
