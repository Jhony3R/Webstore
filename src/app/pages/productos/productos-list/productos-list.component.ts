import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../model/producto';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos-list.component.html',
})
export class ProductosListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private router = inject(Router);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroEstado = signal<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');

  productosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();

    return this.productos().filter((p) => {
      const coincideTexto =
        !texto ||
        p.codigo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto) ||
        (p.marca ?? '').toLowerCase().includes(texto);

      const coincideEstado =
        estado === 'TODOS' || (estado === 'ACTIVO' ? p.activo : !p.activo);

      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.findAll().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  nuevoProducto(): void {
    this.router.navigate(['/admin/productos/nuevo']);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/admin/productos/editar', id]);
  }

  estadoStock(p: Producto): 'critico' | 'bajo' | 'normal' {
    if (p.stockActual <= 0) return 'critico';
    if (p.stockActual <= p.stockMinimo) return 'bajo';
    return 'normal';
  }

  toggleEstado(p: Producto): void {
    const accion = p.activo ? 'desactivar' : 'reactivar';

    Swal.fire({
      icon: 'question',
      title: p.activo ? '¿Desactivar producto?' : '¿Reactivar producto?',
      text: p.activo
        ? 'El producto dejará de estar disponible para la venta.'
        : 'El producto volverá a estar disponible para la venta.',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#B3AC9C',
      heightAuto: false,
    }).then((result) => {
      if (!result.isConfirmed || !p.idProducto) return;

      const request$ = p.activo
        ? this.productoService.desactivar(p.idProducto)
        : this.productoService.reactivar(p.idProducto);

      request$.subscribe({
        next: () => {
          this.cargarProductos();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Producto ${accion === 'desactivar' ? 'desactivado' : 'reactivado'}`,
            showConfirmButton: false,
            timer: 2200,
          });
        },
      });
    });
  }
}
