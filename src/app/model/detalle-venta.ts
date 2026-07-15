import { Producto } from "./producto";
import { Venta } from "./venta";

export class DetalleVenta {
    idDetalleVenta:number;
    cantidad:number;
    precioUnitario:number;
    subTotal:number;
    venta:Venta;
    producto:Producto;
}
