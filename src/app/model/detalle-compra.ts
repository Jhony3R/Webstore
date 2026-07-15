import { Compra } from "./compra";
import { Producto } from "./producto";

export class DetalleCompra {
    idDetalleCompra:number;
    cantidad:number;
    precioUnitario:number;
    subTotal:number;
    compra:Compra;
    producto:Producto;
}
