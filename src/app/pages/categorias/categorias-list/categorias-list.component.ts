import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../model/categoria';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias-list.component.html',
})
export class CategoriasListComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  cargando = signal(true);
  categorias = signal<Categoria[]>([]);
  busqueda = signal('');
  filtroEstado = signal<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');

  categoriasFiltradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();

    return this.categorias().filter((c) => {
      const coincideTexto =
        !texto ||
        c.nombre?.toLowerCase().includes(texto) ||
        c.descripcion?.toLowerCase().includes(texto);

      const coincideEstado =
        estado === 'TODOS' ||
        (estado === 'ACTIVO' && c.activo) ||
        (estado === 'INACTIVO' && !c.activo);

      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando.set(true);
    this.categoriaService.findAll().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.categoriaService.setCategoriaChange(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar las categorías',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  nuevaCategoria(): void {
    this.router.navigate(['/admin/categorias/nuevo']);
  }

  editarCategoria(id: number): void {
    this.router.navigate(['/admin/categorias/editar', id]);
  }

  toggleEstado(categoria: Categoria): void {
    const accion = categoria.activo ? 'desactivar' : 'reactivar';

    Swal.fire({
      icon: 'question',
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} categoría?`,
      text: `¿Deseas ${accion} la categoría "${categoria.nombre}"?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#8B8778',
      heightAuto: false,
    }).then((result) => {
      if (!result.isConfirmed) return;

      const actualizado: Categoria = { ...categoria, activo: !categoria.activo };

      this.categoriaService.update(categoria.idCategoria!, actualizado).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Categoría ${categoria.activo ? 'desactivada' : 'reactivada'}`,
            showConfirmButton: false,
            timer: 2200,
          });
          this.cargarCategorias();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: `No se pudo ${accion} la categoría`,
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          });
        },
      });
    });
  }
}
