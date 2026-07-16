import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario';
import { RolUsuario } from '../../../model/enums';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-form.component.html'
})
export class UsuariosFormComponent implements OnInit {
  usuario: Partial<Usuario> = {
    username: '',
    password: '',
    nombreCompleto: '',
    email: '',
    rol: 'VENDEDOR',
    activo: true
  };

  confirmarPassword = '';
  esEdicion = false;
  guardando = false;

  roles: RolUsuario[] = ['ADMINISTRADOR', 'VENDEDOR'];

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.usuarioService.findById(Number(id)).subscribe({
        next: (data) => {
          this.usuario = { ...data, password: '' };
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo cargar el usuario',
            confirmButtonColor: '#7C2D3B',
            heightAuto: false,
          }).then(() => this.router.navigate(['/admin/usuarios']));
        }
      });
    }
  }

  guardar(): void {
    if (!this.usuario.username?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'El nombre de usuario es obligatorio.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    const cambiaPassword = !this.esEdicion || !!this.usuario.password;

    if (cambiaPassword) {
      if (!this.usuario.password || this.usuario.password.length < 6) {
        Swal.fire({
          icon: 'warning',
          title: 'Contraseña inválida',
          text: 'La contraseña debe tener al menos 6 caracteres.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
        return;
      }
      if (this.usuario.password !== this.confirmarPassword) {
        Swal.fire({
          icon: 'warning',
          title: 'Las contraseñas no coinciden',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
        return;
      }
    }

    this.guardando = true;

    const payload = { ...this.usuario } as Usuario;
    if (this.esEdicion && !this.usuario.password) {
      delete (payload as any).password;
    }

    const peticion = this.esEdicion
      ? this.usuarioService.update(this.usuario.idUsuario!, payload)
      : this.usuarioService.save(payload);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.esEdicion ? 'Usuario actualizado' : 'Usuario creado',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el usuario',
          text: err?.error?.message || 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
