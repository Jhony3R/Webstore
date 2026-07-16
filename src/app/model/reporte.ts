export class VentaDiaria {
  fecha: string;
  cantidadVentas: number;
  totalEfectivo: number;
  totalYape: number;
  totalPlin: number;
  totalTarjeta: number;
  totalTransferencia: number;
  totalGeneral: number;
}

export class ProductoMasVendido {
  codigo: string;
  descripcion: string;
  categoria: string;
  cantidadVendida: number;
  totalIngresos: number;
}

export class GananciaPeriodo {
  fecha: string;
  totalVentas: number;
  totalCompras: number;
  gananciaNeta: number;
}

export class EstadoInventarioItem {
  codigo: string;
  descripcion: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  precioVenta: number;
}
