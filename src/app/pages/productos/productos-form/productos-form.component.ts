import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../model/producto';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos-form.component.html',
})
export class ProductosFormComponent implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  esEdicion = false;
  guardando = false;

  producto: Producto = {
    codigo: '',
    descripcion: '',
    marca: '',
    color: '',
    talla: '',
    precioCompra: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 5,
    activo: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.productoService.findById(+id).subscribe({
        next: (data) => (this.producto = data),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar el producto',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          }).then(() => this.router.navigate(['/admin/productos']));
        },
      });
    }
  }

  guardar(): void {
    if (!this.producto.codigo.trim() || !this.producto.descripcion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Código y descripción son obligatorios.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    if (this.producto.precioVenta <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: 'El precio de venta debe ser mayor a 0.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.guardando = true;

    const request$ =
      this.esEdicion && this.producto.idProducto
        ? this.productoService.update(this.producto.idProducto, this.producto)
        : this.productoService.save(this.producto);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.esEdicion ? 'Producto actualizado' : 'Producto creado',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/productos']);
      },
      error: () => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el producto',
          text: 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/productos']);
  }
}
