import { TipoDocumento } from "./enums";

export class Cliente {
    idCliente:number;
    numeroDocumento:string;
    nombres:string;
    apellidoPaterno:string;
    apellidoMaterno:string;
    tipoDocumento:TipoDocumento;
    telefono:string;
    email:string;
    direccion:string;
    fechaRegistro:string;
}
