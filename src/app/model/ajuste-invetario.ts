import { TipoAjusteInventario } from "./enums";
import { Producto } from "./producto";
import { Usuario } from "./usuario";

export class AjusteInventario {
    idAjusteInventario: number;
    cantidad: number;
    motivo:string;
    stockAnterior:number;
    stockNuevo:number;
    fecha:string;
    tipoAjusteInventario:TipoAjusteInventario;
    producto:Producto;
    usuario:Usuario;
}
