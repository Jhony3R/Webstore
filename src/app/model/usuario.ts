import { RolUsuario } from "./enums";

export class Usuario {
    idUsuario:number;
    username:string;
    password:string;
    nombreCompleto:string;
    email:string;
    rol:RolUsuario;
    activo:boolean;
    fechaCreacion:string;
    ultimoAcceso:string;
}
