import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AjusteInventarioService } from '../../../services/ajuste-inventario.service';
import { AjusteInventario } from '../../../model/ajuste-invetario';
import { TipoAjusteInventario } from '../../../model/enums';

@Component({
  selector: 'app-ajuste-inventario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ajuste-inventario-list.component.html',
})
export class AjusteInventarioListComponent implements OnInit {
  ajustes = signal<AjusteInventario[]>([]);
  cargando = signal<boolean>(true);

  busqueda = signal<string>('');
  filtroTipo = signal<TipoAjusteInventario | 'TODOS'>('TODOS');

  tipos: TipoAjusteInventario[] = ['MERMA', 'PERDIDA', 'DEVOLUCION', 'CORRECCION', 'INGRESO_COMPRA'];

  ajustesFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const tipo = this.filtroTipo();

    return this.ajustes()
      .filter((a) => {
        const coincideTexto =
          !texto ||
          a.producto?.codigo?.toLowerCase().includes(texto) ||
          a.producto?.descripcion?.toLowerCase().includes(texto) ||
          a.motivo?.toLowerCase().includes(texto) ||
          a.usuario?.username?.toLowerCase().includes(texto);

        const coincideTipo = tipo === 'TODOS' || a.tipoAjusteInventario === tipo;

        return coincideTexto && coincideTipo;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  constructor(
    private ajusteInventarioService: AjusteInventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAjustes();
  }

  cargarAjustes(): void {
    this.cargando.set(true);
    this.ajusteInventarioService.findAll().subscribe({
      next: (data) => {
        this.ajustes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el historial de ajustes',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  nuevoAjuste(): void {
    this.router.navigate(['/admin/ajuste-inventario/nuevo']);
  }

  esPositivo(tipo: TipoAjusteInventario): boolean {
    return tipo === 'DEVOLUCION' || tipo === 'INGRESO_COMPRA';
  }

  esNegativo(tipo: TipoAjusteInventario): boolean {
    return tipo === 'MERMA' || tipo === 'PERDIDA';
  }

  etiquetaTipo(tipo: TipoAjusteInventario): string {
    const etiquetas: Record<TipoAjusteInventario, string> = {
      MERMA: 'Merma',
      PERDIDA: 'Pérdida',
      DEVOLUCION: 'Devolución',
      CORRECCION: 'Corrección',
      INGRESO_COMPRA: 'Ingreso de compra',
    };
    return etiquetas[tipo] ?? tipo;
  }

  eliminar(ajuste: AjusteInventario): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este ajuste?',
      html: `Esto <strong>revertirá el efecto sobre el stock</strong> de <strong>${ajuste.producto?.codigo ?? ''}</strong>.<br>Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#8B8778',
      heightAuto: false,
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.ajusteInventarioService.delete(ajuste.idAjusteInventario).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Ajuste eliminado y stock revertido',
            showConfirmButton: false,
            timer: 2200,
          });
          this.cargarAjustes();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar el ajuste',
            text: err?.error?.message || 'Verifica que el stock resultante no quede negativo.',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          });
        },
      });
    });
  }
}
