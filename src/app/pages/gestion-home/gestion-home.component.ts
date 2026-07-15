import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VentaReciente {
  comprobante: string;
  cliente: string;
  total: number;
  metodoPago: string;
  hora: string;
}

interface ProductoStockBajo {
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

@Component({
  selector: 'app-gestion-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-home.component.html',
})
export class GestionHomeComponent implements OnInit {
  username = signal<string>('');
  fechaHoy = new Date();

  // TODO: reemplazar por datos reales desde venta.service.ts, caja.service.ts, producto.service.ts
  ventasHoy = 1240.5;
  cantidadVentasHoy = 18;
  cajaAbierta = true;
  saldoCaja = 350.0;

  ventasRecientes: VentaReciente[] = [
    { comprobante: 'B001-0245', cliente: 'María Quispe', total: 89.9, metodoPago: 'YAPE', hora: '11:42' },
    { comprobante: 'B001-0244', cliente: 'Cliente varios', total: 45.0, metodoPago: 'EFECTIVO', hora: '11:20' },
    { comprobante: 'B001-0243', cliente: 'Jorge Palomino', total: 156.0, metodoPago: 'TARJETA', hora: '10:55' },
    { comprobante: 'B001-0242', cliente: 'Rosa Huamán', total: 72.5, metodoPago: 'PLIN', hora: '10:12' },
  ];

  productosStockBajo: ProductoStockBajo[] = [
    { nombre: 'Casaca jean azul - M', stockActual: 2, stockMinimo: 5 },
    { nombre: 'Polo básico blanco - L', stockActual: 3, stockMinimo: 8 },
    { nombre: 'Pantalón cargo negro - 32', stockActual: 1, stockMinimo: 5 },
  ];

  ngOnInit(): void {
    this.username.set(sessionStorage.getItem('username') || 'Usuario');
  }

  get productoMasBajo(): number {
    if (!this.productosStockBajo.length) return 0;
    return Math.min(...this.productosStockBajo.map((p) => p.stockActual / p.stockMinimo));
  }
}
