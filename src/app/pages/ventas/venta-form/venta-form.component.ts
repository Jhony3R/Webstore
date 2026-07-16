import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { VentaService, VentaRequest, DetalleVentaRequest } from '../../../services/venta.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { Cliente } from '../../../model/cliente';
import { Producto } from '../../../model/producto';
import { MetodoPago, TipoDescuento, METODOS_PAGO, METODO_PAGO_LABELS } from '../../../model/enums';

interface FilaDetalle {
  idProducto: number | null;
  producto?: Producto;
  cantidad: number;
  equivalentes?: Producto[];
}

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venta-form.component.html',
})
export class VentaFormComponent implements OnInit {
  private ventaService = inject(VentaService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  guardando = false;
  generandoComprobante = false;

  clientes: Cliente[] = [];
  productos: Producto[] = [];

  metodosPago: MetodoPago[] = METODOS_PAGO;
  metodoPagoLabels = METODO_PAGO_LABELS;

  idCliente: number | null = null;
  metodoPago: MetodoPago | '' = '';

  aplicarDescuento = false;
  tipoDescuento: TipoDescuento = 'PORCENTAJE';
  valorDescuentoInput = 0;

  filas: FilaDetalle[] = [];

  mostrarNuevoCliente = false;
  clienteEncontrado = false;
  guardandoCliente = false;

  nuevoCliente: Partial<Cliente> = {
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
  };

  ngOnInit(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => (this.clientes = data),
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los clientes',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });

    this.productoService.findAll().subscribe({
      next: (data) => (this.productos = data),
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los productos',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });

    this.agregarFila();
  }

  agregarFila(): void {
    this.filas.push({ idProducto: null, cantidad: 1 });
  }

  eliminarFila(index: number): void {
    this.filas.splice(index, 1);
    if (this.filas.length === 0) {
      this.agregarFila();
    }
  }

  onProductoSeleccionado(fila: FilaDetalle): void {
    fila.producto = this.productos.find((p) => p.idProducto === fila.idProducto);
    if (fila.producto && fila.cantidad < 1) {
      fila.cantidad = 1;
    }

    fila.equivalentes = [];

    if (fila.producto && fila.producto.stockActual === 0) {
      fila.equivalentes = this.productos.filter(
        (p) =>
          p.idProducto !== fila.producto!.idProducto &&
          p.stockActual > 0 &&
          p.idCategoria === fila.producto!.idCategoria &&
          p.talla === fila.producto!.talla
      );

      Swal.fire({
        icon: 'warning',
        title: 'Producto agotado',
        text: `"${fila.producto.descripcion}" no tiene stock disponible. Elige un artículo equivalente si lo necesitas.`,
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
    }
  }

  seleccionarEquivalente(fila: FilaDetalle, equivalente: Producto): void {
    fila.idProducto = equivalente.idProducto ?? null;
    this.onProductoSeleccionado(fila);
  }

  precioUnitario(fila: FilaDetalle): number {
    return fila.producto?.precioVenta ?? 0;
  }

  subtotalFila(fila: FilaDetalle): number {
    return this.precioUnitario(fila) * (fila.cantidad || 0);
  }

  get subTotal(): number {
    return this.filas.reduce((acc, fila) => acc + this.subtotalFila(fila), 0);
  }

  get valorDescuento(): number {
    if (!this.aplicarDescuento || !this.valorDescuentoInput) return 0;
    const monto =
      this.tipoDescuento === 'PORCENTAJE'
        ? this.subTotal * (this.valorDescuentoInput / 100)
        : this.valorDescuentoInput;
    return Math.min(monto, this.subTotal);
  }

  get total(): number {
    return Math.max(this.subTotal - this.valorDescuento, 0);
  }

  private filasValidas(): FilaDetalle[] {
    return this.filas.filter((f) => f.idProducto && f.cantidad > 0);
  }

  guardar(): void {

    if (!this.metodoPago) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un método de pago',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const detalles: DetalleVentaRequest[] = this.filasValidas().map((f) => ({
      idProducto: f.idProducto as number,
      cantidad: f.cantidad,
    }));

    if (detalles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Agrega al menos un producto',
        text: 'Debes seleccionar producto y cantidad en al menos una fila.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const stockInsuficiente = this.stockInsuficienteAgregado();
    if (stockInsuficiente) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: `"${stockInsuficiente.producto?.descripcion}" solo tiene ${stockInsuficiente.producto?.stockActual} unidades disponibles.`,
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const request: VentaRequest = {
      idCliente: this.idCliente,
      metodoPago: this.metodoPago,
      detalles,
    };

    if (this.aplicarDescuento && this.valorDescuentoInput > 0) {
      request.tipoDescuento = this.tipoDescuento;
      request.valorDescuentoInput = this.valorDescuentoInput;
    }

    this.guardando = true;

    this.ventaService.registrarVenta(request).subscribe({
      next: (venta) => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: venta?.numeroComprobante
            ? `Venta ${venta.numeroComprobante} registrada`
            : 'Venta registrada',
          showConfirmButton: false,
          timer: 2500,
        });
        this.limpiarFormulario();
        this.recargarProductos();
      },
      error: (err) => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar la venta',
          text: err?.error?.message || 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        }).then(() => {
          this.recargarProductos();
        });
      },
    });
  }

  verComprobante(idVenta: number): void {
    const ventana = window.open('', '_blank');
    this.generandoComprobante = true;

    this.ventaService.descargarComprobante(idVenta).subscribe({
      next: (pdf) => {
        this.generandoComprobante = false;
        const url = window.URL.createObjectURL(pdf);
        if (ventana) {
          ventana.location.href = url;
        } else {
          window.open(url, '_blank');
        }
      },
      error: () => {
        this.generandoComprobante = false;
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

  private recargarProductos(): void {
    this.productoService.findAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.actualizarProductosDeFilas();
      },
      error: () => {},
    });
  }

  private actualizarProductosDeFilas(): void {
    this.filas.forEach((fila) => {
      if (fila.idProducto) {
        fila.producto = this.productos.find((p) => p.idProducto === fila.idProducto);
      }
    });
  }

  limpiarFormulario(): void {
    this.idCliente = null;
    this.metodoPago = '';
    this.aplicarDescuento = false;
    this.tipoDescuento = 'PORCENTAJE';
    this.valorDescuentoInput = 0;
    this.filas = [];
    this.agregarFila();
  }

  productosParaFila(filaActual: FilaDetalle): Producto[] {
    const idsUsadosEnOtrasFilas = this.filas
      .filter((f) => f !== filaActual && f.idProducto !== null)
      .map((f) => f.idProducto);

    return this.productos.filter((p) => !idsUsadosEnOtrasFilas.includes(p.idProducto ?? null));
  }

  private stockInsuficienteAgregado(): FilaDetalle | undefined {
    return this.filasValidas().find(
      (f) => f.producto && f.cantidad > f.producto.stockActual
    );
  }

  irAlHistorial(): void {
    this.router.navigate(['/admin/ventas/historial']);
  }

  abrirModalCliente(): void {
    this.mostrarNuevoCliente = true;
    this.clienteEncontrado = false;
    this.nuevoCliente = {
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
    };
  }

  cerrarModalCliente(): void {
    this.mostrarNuevoCliente = false;
  }

  buscarClientePorDocumento(): void {
    const doc = this.nuevoCliente.numeroDocumento?.trim();
    if (!doc) return;

    this.clienteService.buscarPorDocumento(doc).subscribe({
      next: (cliente) => {
        this.clienteEncontrado = true;
        this.nuevoCliente = { ...cliente };
        this.idCliente = cliente.idCliente!;
      },
      error: () => {
        this.clienteEncontrado = false;
      },
    });
  }

  guardarNuevoCliente(): void {
    if (!this.nuevoCliente.numeroDocumento || !this.nuevoCliente.nombres || !this.nuevoCliente.apellidoPaterno) {
      Swal.fire({
        icon: 'warning',
        title: 'Completa los datos del cliente',
        text: 'Documento, nombres y apellido paterno son obligatorios.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.guardandoCliente = true;
    this.clienteService.save(this.nuevoCliente as Cliente).subscribe({
      next: (clienteCreado) => {
        this.guardandoCliente = false;
        this.clientes.push(clienteCreado);
        this.idCliente = clienteCreado.idCliente!;
        this.mostrarNuevoCliente = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Cliente registrado',
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: (err) => {
        this.guardandoCliente = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar el cliente',
          text: err?.error?.message || 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      },
    });
  }
}
