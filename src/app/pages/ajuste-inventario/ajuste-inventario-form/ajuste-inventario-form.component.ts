import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AjusteInventarioService } from '../../../services/ajuste-inventario.service';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../model/producto';
import { TipoAjusteInventario } from '../../../model/enums';

interface AjusteInventarioRequest {
  idProducto: number | null;
  cantidad: number | null;
  motivo: string;
  tipoAjusteInventario: TipoAjusteInventario | '';
}

@Component({
  selector: 'app-ajuste-inventario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajuste-inventario-form.component.html',
})
export class AjusteInventarioFormComponent implements OnInit {
  productos: Producto[] = [];
  guardando = false;
  cargandoProductos = true;

  request: AjusteInventarioRequest = {
    idProducto: null,
    cantidad: null,
    motivo: '',
    tipoAjusteInventario: '',
  };

  tipos: { valor: TipoAjusteInventario; etiqueta: string }[] = [
    { valor: 'MERMA', etiqueta: 'Merma (prenda dañada)' },
    { valor: 'PERDIDA', etiqueta: 'Pérdida' },
    { valor: 'DEVOLUCION', etiqueta: 'Devolución' },
    { valor: 'INGRESO_COMPRA', etiqueta: 'Ingreso de compra' },
    { valor: 'CORRECCION', etiqueta: 'Corrección de conteo físico' },
  ];

  constructor(
    private ajusteInventarioService: AjusteInventarioService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.findAll().subscribe({
      next: (data) => {
        this.productos = data.filter((p) => p.activo);
        this.cargandoProductos = false;
      },
      error: () => {
        this.cargandoProductos = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los productos',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  get productoSeleccionado(): Producto | undefined {
    return this.productos.find((p) => p.idProducto === this.request.idProducto);
  }

  get esCorreccion(): boolean {
    return this.request.tipoAjusteInventario === 'CORRECCION';
  }

  get esNegativo(): boolean {
    return this.request.tipoAjusteInventario === 'MERMA' || this.request.tipoAjusteInventario === 'PERDIDA';
  }

  get stockResultanteEstimado(): number | null {
    const producto = this.productoSeleccionado;
    if (!producto || this.request.cantidad === null || !this.request.tipoAjusteInventario) return null;

    if (this.esCorreccion) return this.request.cantidad;
    if (this.esNegativo) return producto.stockActual - this.request.cantidad;
    return producto.stockActual + this.request.cantidad;
  }

  guardar(): void {
    if (!this.request.idProducto) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un producto',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    if (!this.request.tipoAjusteInventario) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona el tipo de ajuste',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    if (this.request.cantidad === null || this.request.cantidad < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Ingresa un valor de 0 o mayor.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    if (!this.request.motivo.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'El motivo es obligatorio',
        text: 'Describe brevemente la razón del ajuste.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    if (this.stockResultanteEstimado !== null && this.stockResultanteEstimado < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: 'Ese ajuste dejaría el stock en negativo. Verifica la cantidad.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.guardando = true;

    this.ajusteInventarioService.save(this.request as any).subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Ajuste registrado correctamente',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/ajuste-inventario']);
      },
      error: (err) => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar el ajuste',
          text: err?.error?.message || 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/ajuste-inventario']);
  }
}
