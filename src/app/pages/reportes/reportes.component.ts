import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReporteService, TipoReporte, FormatoExportacion } from '../../services/reporte.service';
import {
  VentaDiaria,
  ProductoMasVendido,
  GananciaPeriodo,
  EstadoInventarioItem,
} from '../../model/reporte';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);

  tipoReporte = signal<TipoReporte>('ventas');
  fechaInicio = signal(this.primerDiaDelMes());
  fechaFin = signal(this.hoy());

  cargando = signal(false);
  exportando = signal(false);

  ventas = signal<VentaDiaria[]>([]);
  productos = signal<ProductoMasVendido[]>([]);
  ganancias = signal<GananciaPeriodo[]>([]);
  inventario = signal<EstadoInventarioItem[]>([]);

  totalesVentas = computed(() => {
    const data = this.ventas();
    return {
      cantidad: data.reduce((acc, v) => acc + v.cantidadVentas, 0),
      total: data.reduce((acc, v) => acc + v.totalGeneral, 0),
    };
  });

  totalesGanancias = computed(() => {
    const data = this.ganancias();
    return {
      ventas: data.reduce((acc, g) => acc + g.totalVentas, 0),
      compras: data.reduce((acc, g) => acc + g.totalCompras, 0),
      neto: data.reduce((acc, g) => acc + g.gananciaNeta, 0),
    };
  });

  maxCantidadVendida = computed(() => {
    const data = this.productos();
    return data.length ? Math.max(...data.map((p) => p.cantidadVendida)) : 0;
  });

  inventarioCritico = computed(() =>
    this.inventario().filter((i) => i.stockActual <= i.stockMinimo)
  );

  ngOnInit(): void {
    this.generarReporte();
  }

  private hoy(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private primerDiaDelMes(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().substring(0, 10);
  }

  cambiarTipoReporte(tipo: TipoReporte): void {
    this.tipoReporte.set(tipo);
    this.generarReporte();
  }

  generarReporte(): void {
    if (this.tipoReporte() !== 'inventario' && this.fechaInicio() > this.fechaFin()) {
      Swal.fire({
        icon: 'warning',
        title: 'Rango de fechas inválido',
        text: 'La fecha de inicio no puede ser mayor a la fecha final.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.cargando.set(true);
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();

    switch (this.tipoReporte()) {
      case 'ventas':
        this.reporteService.getVentasDiarias(inicio, fin).subscribe({
          next: (data) => {
            this.ventas.set(data);
            this.cargando.set(false);
          },
          error: () => this.manejarError(),
        });
        break;

      case 'productos':
        this.reporteService.getProductosMasVendidos(inicio, fin).subscribe({
          next: (data) => {
            this.productos.set(data);
            this.cargando.set(false);
          },
          error: () => this.manejarError(),
        });
        break;

      case 'ganancias':
        this.reporteService.getGanancias(inicio, fin).subscribe({
          next: (data) => {
            this.ganancias.set(data);
            this.cargando.set(false);
          },
          error: () => this.manejarError(),
        });
        break;

      case 'inventario':
        this.reporteService.getEstadoInventario().subscribe({
          next: (data) => {
            this.inventario.set(data);
            this.cargando.set(false);
          },
          error: () => this.manejarError(),
        });
        break;
    }
  }

  estadoStock(item: EstadoInventarioItem): 'critico' | 'bajo' | 'normal' {
    if (item.stockActual <= 0) return 'critico';
    if (item.stockActual <= item.stockMinimo) return 'bajo';
    return 'normal';
  }

  private manejarError(): void {
    this.cargando.set(false);
    Swal.fire({
      icon: 'error',
      title: 'No se pudo generar el reporte',
      text: 'Ocurrió un problema al consultar los datos. Intenta nuevamente.',
      confirmButtonColor: '#7C2D3B',
      heightAuto: false,
    });
  }

  exportar(formato: FormatoExportacion): void {
    this.exportando.set(true);

    this.reporteService
      .exportar(this.tipoReporte(), formato, this.fechaInicio(), this.fechaFin())
      .subscribe({
        next: (blob) => {
          this.exportando.set(false);
          const extension = formato === 'excel' ? 'xlsx' : 'pdf';
          const nombreArchivo = `reporte-${this.tipoReporte()}-${this.fechaInicio()}_${this.fechaFin()}.${extension}`;

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = nombreArchivo;
          link.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Reporte exportado correctamente',
            showConfirmButton: false,
            timer: 2200,
          });
        },
        error: () => {
          this.exportando.set(false);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo exportar el reporte',
            text: 'Verifica la conexión con el servidor e intenta nuevamente.',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          });
        },
      });
  }
}
