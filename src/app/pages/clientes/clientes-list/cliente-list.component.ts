import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html'
})
export class ClienteListComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroTipoDocumento = signal<'TODOS' | 'DNI' | 'RUC' | 'CE'>('TODOS');

  clientesFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const tipo = this.filtroTipoDocumento();

    return this.clientes().filter(c => {
      const coincideTexto = !texto ||
        c.numeroDocumento.toLowerCase().includes(texto) ||
        c.nombres.toLowerCase().includes(texto) ||
        c.apellidoPaterno.toLowerCase().includes(texto) ||
        c.apellidoMaterno.toLowerCase().includes(texto);

      const coincideTipo = tipo === 'TODOS' || c.tipoDocumento === tipo;

      return coincideTexto && coincideTipo;
    });
  });

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando.set(true);
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  nuevoCliente(): void {
    this.router.navigate(['/admin/clientes/nuevo']);
  }

  editarCliente(id: number): void {
    this.router.navigate(['/admin/clientes/editar', id]);
  }

  eliminarCliente(cliente: Cliente): void {
    if (!confirm(`¿Eliminar al cliente ${cliente.nombres} ${cliente.apellidoPaterno}?`)) {
      return;
    }
    this.clienteService.delete(cliente.idCliente).subscribe({
      next: () => {
        this.clienteService.setMessageChange('Cliente eliminado correctamente.');
        this.cargarClientes();
      },
      error: () => this.clienteService.setMessageChange('No se pudo eliminar el cliente.')
    });
  }

  nombreCompleto(c: Cliente): string {
    return `${c.nombres} ${c.apellidoPaterno} ${c.apellidoMaterno}`.trim();
  }
}
