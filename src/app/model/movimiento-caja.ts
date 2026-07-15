import { Caja } from "./caja";
import { MetodoPago, TipoMovimientoCaja } from "./enums";
import { Venta } from "./venta";

export class MovimientoCaja {
    idMovimientoCaja:number;
    concepto:string;
    monto:number;
    fecha:string;
    tipoMovimientoCaja:TipoMovimientoCaja;
    metodoPago:MetodoPago;
    caja:Caja;
    venta:Venta;
}
