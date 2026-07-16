import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../model/venta';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ventas-list.component.html',
})
export class VentasListComponent implements OnInit {
  private ventaService = inject(VentaService);
  private tokenService = inject(TokenService);

  esAdministrador = this.tokenService.getRol() === 'ADMINISTRADOR';

  ventas = signal<Venta[]>([]);
  cargando = signal(true);

  generandoComprobanteId = signal<number | null>(null);

  busqueda = signal('');
  filtroEstado = signal<'TODOS' | 'COMPLETADA' | 'ANULADA'>('TODOS');
  fechaDesde = signal('');
  fechaHasta = signal('');

  ventasFiltradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();

    return this.ventas().filter((v) => {
      const fechaVenta = v.fecha ? v.fecha.substring(0, 10) : '';

      const coincideTexto =
        !texto ||
        (v.numeroComprobante ?? '').toLowerCase().includes(texto) ||
        this.clienteNombre(v).toLowerCase().includes(texto);

      const coincideEstado = estado === 'TODOS' || (v.estadoVenta as unknown as string) === estado;

      const coincideDesde = !desde || fechaVenta >= desde;
      const coincideHasta = !hasta || fechaVenta <= hasta;

      return coincideTexto && coincideEstado && coincideDesde && coincideHasta;
    });
  });

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.cargando.set(true);
    this.ventaService.findAll().subscribe({
      next: (data) => {
        this.ventas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  clienteNombre(v: Venta): string {
    const c = v.cliente as any;
    if (!c) {
      return 'Sin cliente';
    }
    return [c.nombres, c.apellidoPaterno, c.apellidoMaterno].filter(Boolean).join(' ');
  }

  estaAnulada(v: Venta): boolean {
    return (v.estadoVenta as unknown as string) === 'ANULADA';
  }

  verComprobante(v: Venta): void {
    if (!v.idVenta) return;

    const ventana = window.open('', '_blank');
    this.generandoComprobanteId.set(v.idVenta);

    this.ventaService.descargarComprobante(v.idVenta).subscribe({
      next: (pdf) => {
        this.generandoComprobanteId.set(null);
        const url = window.URL.createObjectURL(pdf);
        if (ventana) {
          ventana.location.href = url;
        } else {
          window.open(url, '_blank');
        }
      },
      error: () => {
        this.generandoComprobanteId.set(null);
        ventana?.close();
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener el comprobante',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  anularVenta(v: Venta): void {
    if (!this.esAdministrador || this.estaAnulada(v) || !v.idVenta) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Anular esta venta?',
      html: `Se anulará el comprobante <b>${v.numeroComprobante}</b> y se repondrá el stock. Esta acción no se puede deshacer.`,
      input: 'text',
      inputLabel: 'Motivo de anulación',
      inputPlaceholder: 'Ej. Error en el registro',
      showCancelButton: true,
      confirmButtonText: 'Anular venta',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#B3AC9C',
      heightAuto: false,
      inputValidator: (value) => (!value ? 'Debes indicar un motivo' : undefined),
    }).then((result) => {
      if (!result.isConfirmed || !v.idVenta) return;

      this.ventaService.anularVenta(v.idVenta, result.value).subscribe({
        next: () => {
          this.cargarVentas();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Venta anulada',
            showConfirmButton: false,
            timer: 2200,
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo anular la venta',
            text: err?.error?.message || 'Verifica los datos e intenta nuevamente.',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          });
        },
      });
    });
  }
}
