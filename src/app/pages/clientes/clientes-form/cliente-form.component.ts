import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../model/cliente';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  idCliente: number | null = null;
  cargando = false;
  guardando = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.maxLength(15)]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: [''],
      email: ['', Validators.email],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.idCliente = +id;
      this.cargarCliente(this.idCliente);
    }
  }

  cargarCliente(id: number): void {
    this.cargando = true;
    this.clienteService.findById(id).subscribe({
      next: (cliente) => {
        this.form.patchValue(cliente);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el cliente',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        }).then(() => this.router.navigate(['/admin/clientes']));
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Revisa los campos obligatorios del formulario.',
        confirmButtonColor: '#7C2D3B',
        heightAuto: false,
      });
      return;
    }

    this.guardando = true;
    this.error = '';
    const datos = this.form.value as Cliente;

    const request$ = this.editando && this.idCliente
      ? this.clienteService.update(this.idCliente, datos)
      : this.clienteService.save(datos);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.editando ? 'Cliente actualizado' : 'Cliente creado',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/clientes']);
      },
      error: () => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el cliente',
          text: 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/clientes']);
  }
}
