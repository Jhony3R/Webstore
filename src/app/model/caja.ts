import { EstadoCaja } from "./enums";
import { Usuario } from "./usuario";

export class Caja {
    idCaja: number;
    saldoInicial:number;
    saldoEsperadoEfectivo:number;
    efectivoContado:number;
    descuadre:number;
    estadoCaja:EstadoCaja;
    observacionDescuadre:string;
    totalYape:number;
    totalPlin:number;
    totalTarjeta:number;
    totalTransferencia:number;
    fechaApertura:string;
    fechaCierre?:string;
    usuario?: Usuario;
}
