import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  VentaDiaria,
  ProductoMasVendido,
  GananciaPeriodo,
  EstadoInventarioItem,
} from '../model/reporte';

export type TipoReporte = 'ventas' | 'productos' | 'ganancias' | 'inventario';
export type FormatoExportacion = 'excel' | 'pdf';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.HOST}/api/reporte`;

  getVentasDiarias(fechaInicio: string, fechaFin: string): Observable<VentaDiaria[]> {
    return this.http.get<VentaDiaria[]>(`${this.baseUrl}/ventas-diarias`, {
      params: { fechaInicio, fechaFin },
    });
  }

  getProductosMasVendidos(fechaInicio: string, fechaFin: string): Observable<ProductoMasVendido[]> {
    return this.http.get<ProductoMasVendido[]>(`${this.baseUrl}/productos-mas-vendidos`, {
      params: { fechaInicio, fechaFin },
    });
  }

  getGanancias(fechaInicio: string, fechaFin: string): Observable<GananciaPeriodo[]> {
    return this.http.get<GananciaPeriodo[]>(`${this.baseUrl}/ganancias`, {
      params: { fechaInicio, fechaFin },
    });
  }

  getEstadoInventario(): Observable<EstadoInventarioItem[]> {
    return this.http.get<EstadoInventarioItem[]>(`${this.baseUrl}/inventario`);
  }

  exportar(
    tipoReporte: TipoReporte,
    formato: FormatoExportacion,
    fechaInicio: string,
    fechaFin: string
  ): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/exportar/${tipoReporte}`, {
      params: { formato, fechaInicio, fechaFin },
      responseType: 'blob',
    });
  }
}
