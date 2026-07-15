import { Proveedor } from "./proveedor";
import { Usuario } from "./usuario";

export class Compra {
    idCompra:number;
    numeroComprobante:string;
    fecha:string;
    montoTotal:number;
    proveedor:Proveedor;
    usuario:Usuario;
}
