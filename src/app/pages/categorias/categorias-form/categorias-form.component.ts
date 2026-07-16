import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../model/categoria';

@Component({
  selector: 'app-categorias-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias-form.component.html',
})
export class CategoriasFormComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  esEdicion = false;
  guardando = false;

  categoria: Categoria = {
    nombre: '',
    descripcion: '',
    activo: true,
  };
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.categoriaService.findById(+id).subscribe({
        next: (data) => (this.categoria = data),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar la categoría',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          }).then(() => this.router.navigate(['/admin/categorias']));
        },
      });
    }
  }

  guardar(): void {
    if (!this.categoria.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'El nombre es obligatorio.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.guardando = true;

    const request$ =
      this.esEdicion && this.categoria.idCategoria
        ? this.categoriaService.update(this.categoria.idCategoria, this.categoria)
        : this.categoriaService.save(this.categoria);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.esEdicion ? 'Categoría actualizada' : 'Categoría creada',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/categorias']);
      },
      error: () => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar la categoría',
          text: 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
