import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../model/compra';

@Component({
  selector: 'app-compras-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './compras-list.component.html'
})
export class ComprasListComponent implements OnInit {

  compras = signal<Compra[]>([]);
  cargando = signal<boolean>(true);

  busqueda = signal<string>('');
  fechaDesde = signal<string>('');
  fechaHasta = signal<string>('');

  detalleCompra = signal<Compra | null>(null);
  mostrarDetalle = signal(false);

  eliminandoId = signal<number | null>(null);

  comprasFiltradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();

    return this.compras().filter(c => {
      const coincideTexto = !texto
        || c.numeroComprobante?.toLowerCase().includes(texto)
        || this.proveedorNombre(c).toLowerCase().includes(texto);

      const fechaCompra = c.fecha ? new Date(c.fecha) : null;
      const coincideDesde = !desde || (fechaCompra && fechaCompra >= new Date(desde));
      const coincideHasta = !hasta || (fechaCompra && fechaCompra <= new Date(hasta + 'T23:59:59'));

      return coincideTexto && coincideDesde && coincideHasta;
    });
  });

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando.set(true);
    this.compraService.findAll().subscribe({
      next: (data) => {
        this.compras.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.compraService.setMessageChange('Error al cargar las compras');
      }
    });
  }

  proveedorNombre(compra: Compra): string {
    return (compra.proveedor as any)?.razonSocial ?? (compra.proveedor as any)?.nombre ?? '—';
  }

  usuarioNombre(compra: Compra): string {
    return (compra.usuario as any)?.nombreCompleto ?? (compra.usuario as any)?.username ?? '—';
  }

  eliminarCompra(compra: Compra): void {
    if (!confirm(`¿Eliminar la compra ${compra.numeroComprobante}?`)) return;

    this.eliminandoId.set(compra.idCompra);
    this.compraService.delete(compra.idCompra).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.compraService.setMessageChange('Compra eliminada correctamente');
        this.cargarCompras();
      },
      error: () => {
        this.eliminandoId.set(null);
        this.compraService.setMessageChange('Error al eliminar la compra');
      }
    });
  }

  verDetalle(compra: Compra): void {
    this.detalleCompra.set(compra);
    this.mostrarDetalle.set(true);
  }

  cerrarDetalle(): void {
    this.mostrarDetalle.set(false);
    this.detalleCompra.set(null);
  }
}
