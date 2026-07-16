import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario';
import { RolUsuario } from '../../../model/enums';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.component.html'
})
export class UsuariosListComponent implements OnInit {
  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroEstado = signal<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');
  filtroRol = signal<'TODOS' | RolUsuario>('TODOS');

  usuariosFiltrados = computed(() => {
    const term = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    const rol = this.filtroRol();

    return this.usuarios().filter(u => {
      const coincideTexto = !term ||
        u.username?.toLowerCase().includes(term) ||
        u.nombreCompleto?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);

      const coincideEstado = estado === 'TODOS' ||
        (estado === 'ACTIVO' && u.activo) ||
        (estado === 'INACTIVO' && !u.activo);

      const coincideRol = rol === 'TODOS' || u.rol === rol;

      return coincideTexto && coincideEstado && coincideRol;
    });
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  nuevoUsuario(): void {
    this.router.navigate(['/admin/usuarios/nuevo']);
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  toggleEstado(usuario: Usuario): void {
    const actualizado: Usuario = { ...usuario, activo: !usuario.activo };
    this.usuarioService.update(usuario.idUsuario, actualizado).subscribe({
      next: () => {
        this.usuarioService.setMessageChange(
          actualizado.activo ? 'Usuario reactivado correctamente' : 'Usuario desactivado correctamente'
        );
        this.cargarUsuarios();
      },
      error: () => this.usuarioService.setMessageChange('No se pudo actualizar el estado del usuario')
    });
  }

  iniciales(nombre: string | undefined): string {
    if (!nombre) return '?';
    return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
  }
}
