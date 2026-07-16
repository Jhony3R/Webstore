import { Caja } from "./caja";
import { Cliente } from "./cliente";
import { DetalleVenta } from "./detalle-venta";
import { EstadoVenta, MetodoPago, TipoDescuento } from "./enums";
import { Usuario } from "./usuario";

export class Venta {
    idVenta:number;
    numeroComprobante:string;
    fecha:string;
    subTotal:number;
    valorDescuento:number;
    total:number;
    motivoAnulacion:string;
    fechaAnulacion:string;
    tipodescuento:TipoDescuento;
    metodoPago:MetodoPago;
    estadoVenta:EstadoVenta;
    cliente:Cliente;
    usuario:Usuario;
    caja:Caja;
    detalles: DetalleVenta[] = [];
}
