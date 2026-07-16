export class Producto {
    idProducto?:number;
    codigo:string;
    descripcion:string;
    marca:string;
    talla:string;
    color:string;
    precioCompra:number;
    precioVenta:number;
    stockActual:number;
    stockMinimo:number;
    activo:boolean;
    fechaCreacion?:string;
    idCategoria?: number;
    nombreCategoria?: string;
}
