import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Proveedor } from '../../../model/proveedor';
import { ProveedorService } from '../../../services/proveedor.service';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-list.component.html'
})
export class ProveedorListComponent implements OnInit {
  proveedores = signal<Proveedor[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroEstado = signal<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS');

  proveedoresFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();

    return this.proveedores().filter(p => {
      const coincideTexto = !texto ||
        p.razonSocial.toLowerCase().includes(texto) ||
        p.ruc.toLowerCase().includes(texto) ||
        (p.contacto || '').toLowerCase().includes(texto);

      const coincideEstado =
        estado === 'TODOS' ||
        (estado === 'ACTIVOS' && p.activo) ||
        (estado === 'INACTIVOS' && !p.activo);

      return coincideTexto && coincideEstado;
    });
  });

  constructor(private proveedorService: ProveedorService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.cargando.set(true);
    this.proveedorService.findAll().subscribe({
      next: (data) => {
        this.proveedores.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar la lista de proveedores',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  nuevoProveedor(): void {
    this.router.navigate(['/admin/proveedores/nuevo']);
  }

  editarProveedor(id: number): void {
    this.router.navigate(['/admin/proveedores/editar', id]);
  }

  eliminarProveedor(proveedor: Proveedor): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar proveedor?',
      text: `Se eliminará a ${proveedor.razonSocial}. Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#B3AC9C',
      heightAuto: false,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.proveedorService.delete(proveedor.idProveedor).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Proveedor eliminado',
            showConfirmButton: false,
            timer: 2200,
          });
          this.cargarProveedores();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar el proveedor',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          });
        }
      });
    });
  }
}
