export type RolUsuario = 'ADMINISTRADOR' | 'VENDEDOR';

export type TipoDocumento = 'DNI' | 'RUC' | 'CE';

export type MetodoPago = 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';

export type TipoDescuento = 'PORCENTAJE' | 'MONTO_FIJO';

export type EstadoVenta = 'COMPLETADA' | 'ANULADA';

export type TipoAjusteInventario = 'MERMA' | 'PERDIDA' | 'DEVOLUCION' | 'CORRECCION' | 'INGRESO_COMPRA';

export const EstadoCaja = { ABIERTA: 'ABIERTA', CERRADA: 'CERRADA' } as const;

export type EstadoCaja = typeof EstadoCaja[keyof typeof EstadoCaja];

export type TipoMovimientoCaja = 'INGRESO' | 'EGRESO';

export const METODOS_PAGO: MetodoPago[] = ['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA'];

export const METODO_PAGO_LABELS: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  YAPE: 'Yape',
  PLIN: 'Plin',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
};
