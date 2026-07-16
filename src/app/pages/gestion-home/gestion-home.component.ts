import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { forkJoin, catchError, of, finalize } from 'rxjs';

import { Venta } from '../../model/venta';
import { EstadoInventarioItem, VentaDiaria } from '../../model/reporte';
import { VentaService } from '../../services/venta.service';
import { CajaService } from '../../services/caja.service';
import { ReporteService } from '../../services/reporte.service';

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
  private ventaService = inject(VentaService);
  private cajaService = inject(CajaService);
  private reporteService = inject(ReporteService);

  username = signal<string>('');
  fechaHoy = new Date();

  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  ventasHoy = signal<number>(0);
  cantidadVentasHoy = signal<number>(0);
  cajaAbierta = signal<boolean>(false);
  saldoCaja = signal<number>(0);

  ventasRecientes = signal<VentaReciente[]>([]);
  productosStockBajo = signal<ProductoStockBajo[]>([]);

  ngOnInit(): void {
    this.username.set(sessionStorage.getItem('username') || 'Usuario');
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    const hoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en-US');

    forkJoin({
      ventasDiarias: this.reporteService.getVentasDiarias(hoy, hoy).pipe(
        catchError(() => of([] as VentaDiaria[]))
      ),
      caja: this.cajaService.getCajaAbierta().pipe(
        catchError(() => of(null))
      ),
      ventas: this.ventaService.findAll().pipe(
        catchError(() => of([] as Venta[]))
      ),
      inventario: this.reporteService.getEstadoInventario().pipe(
        catchError(() => of([] as EstadoInventarioItem[]))
      ),
    })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: ({ ventasDiarias, caja, ventas, inventario }) => {
          // KPI: ventas de hoy
          const resumenHoy = ventasDiarias[0];
          this.ventasHoy.set(resumenHoy?.totalGeneral ?? 0);
          this.cantidadVentasHoy.set(resumenHoy?.cantidadVentas ?? 0);

          // Estado de caja
          this.cajaAbierta.set(!!caja);
          // TODO: reemplaza "saldoInicial" por el campo real que representa el saldo actual en tu modelo Caja
          this.saldoCaja.set((caja as any)?.saldoInicial ?? 0);

          // Ventas recientes: últimas 5, ordenadas por fecha descendente
          const recientes = [...ventas]
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 5)
            .map((v) => ({
              comprobante: v.numeroComprobante,
              // TODO: ajusta al campo real de nombre en tu modelo Cliente
              cliente: (v.cliente as any)?.nombre ?? 'Cliente varios',
              total: v.total,
              metodoPago: v.metodoPago as unknown as string,
              hora: formatDate(v.fecha, 'HH:mm', 'en-US'),
            }));
          this.ventasRecientes.set(recientes);

          // Productos con stock bajo o igual al mínimo
          const bajos = inventario
            .filter((p) => p.stockActual <= p.stockMinimo)
            .sort((a, b) => a.stockActual / a.stockMinimo - b.stockActual / b.stockMinimo)
            .map((p) => ({
              nombre: p.descripcion,
              stockActual: p.stockActual,
              stockMinimo: p.stockMinimo,
            }));
          this.productosStockBajo.set(bajos);
        },
        error: () => {
          this.error.set('No se pudieron cargar los datos del panel. Intenta nuevamente.');
        },
      });
  }

  get ticketPromedio(): number {
    const cantidad = this.cantidadVentasHoy();
    return cantidad > 0 ? this.ventasHoy() / cantidad : 0;
  }

  get productoMasBajo(): number {
    const lista = this.productosStockBajo();
    if (!lista.length) return 0;
    return Math.min(...lista.map((p) => p.stockActual / p.stockMinimo));
  }
}
