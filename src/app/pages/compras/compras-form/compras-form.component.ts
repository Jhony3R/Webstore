import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompraRequest, CompraService, DetalleCompraRequest } from '../../../services/compra.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ProductoService } from '../../../services/producto.service';
import { TokenService } from '../../../services/token.service';
import { Proveedor } from '../../../model/proveedor';
import { Producto } from '../../../model/producto';
import Swal from 'sweetalert2';

interface FilaCompra {
  idProducto: number | null;
  producto: Producto | null;
  cantidad: number;
  precioUnitario: number;
}

@Component({
  selector: 'app-compras-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras-form.component.html'
})
export class ComprasFormComponent implements OnInit {

  numeroComprobante = '';
  idProveedor: number | null = null;
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];

  filas: FilaCompra[] = [];

  guardando = false;

  constructor(
    private compraService: CompraService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
    this.agregarFila();
  }

  cargarProveedores(): void {
    this.proveedorService.findAll().subscribe({
      next: (data) => this.proveedores = data,
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los proveedores',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  cargarProductos(): void {
    this.productoService.findAll().subscribe({
      next: (data) => this.productos = data,
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los productos',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  agregarFila(): void {
    this.filas.push({ idProducto: null, producto: null, cantidad: 1, precioUnitario: 0 });
  }

  eliminarFila(index: number): void {
    this.filas.splice(index, 1);
  }

  onProductoSeleccionado(fila: FilaCompra): void {
    const producto = this.productos.find(p => p.idProducto === fila.idProducto) ?? null;
    fila.producto = producto;
    if (producto) {
      fila.precioUnitario = producto.precioCompra ?? 0;
    }
  }

  subtotalFila(fila: FilaCompra): number {
    return (fila.cantidad || 0) * (fila.precioUnitario || 0);
  }

  get subTotal(): number {
    return this.filas.reduce((acc, f) => acc + this.subtotalFila(f), 0);
  }

  get total(): number {
    return this.subTotal;
  }

  irAlHistorial(): void {
    this.router.navigate(['/admin/compras/historial']);
  }

  limpiarFormulario(): void {
    this.numeroComprobante = '';
    this.idProveedor = null;
    this.filas = [];
    this.agregarFila();
  }

  guardar(): void {
    if (!this.numeroComprobante || !this.idProveedor || this.filas.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Completa los campos obligatorios',
        text: 'Número de comprobante, proveedor y detalle son obligatorios.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const detalles: DetalleCompraRequest[] = this.filas
      .filter(f => f.idProducto !== null)
      .map(f => ({
        idProducto: f.idProducto as number,
        cantidad: f.cantidad,
        precioUnitario: f.precioUnitario
      }));

    if (detalles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Agrega al menos un producto',
        text: 'Debes seleccionar al menos un producto para registrar la compra.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const dto: CompraRequest = {
      numeroComprobante: this.numeroComprobante,
      idProveedor: this.idProveedor,
      idUsuario: this.tokenService.getIdUsuario(),
      detalles
    };

    this.guardando = true;
    this.compraService.registrarCompra(dto).subscribe({
      next: () => {
        this.guardando = false;

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Compra registrada correctamente',
          showConfirmButton: false,
          timer: 2500,
        });

        this.limpiarFormulario();
      },
      error: (err) => {
        this.guardando = false;

        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar la compra',
          text: err?.error?.message || err?.error || 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }
}
