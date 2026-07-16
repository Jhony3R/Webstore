import { Injectable } from '@angular/core';
import { Cliente } from '../model/cliente';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente>{
  private clienteChange: Subject<Cliente[]> = new Subject<Cliente[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(
    protected override http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http, `${environment.HOST}/api/cliente`);
  }

  setClienteChange(data: Cliente[]) {
    this.clienteChange.next(data);
  }

  getClienteChange(){
    return this.clienteChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
