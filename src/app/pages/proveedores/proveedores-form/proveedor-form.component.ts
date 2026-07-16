import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../model/proveedor';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedor-form.component.html'
})
export class ProveedorFormComponent implements OnInit {
  form: FormGroup;
  editando = false;
  idProveedor: number | null = null;
  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      razonSocial: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.maxLength(11)]],
      contacto: [''],
      telefono: [''],
      email: ['', Validators.email],
      direccion: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.idProveedor = +id;
      this.cargarProveedor(this.idProveedor);
    }
  }

  cargarProveedor(id: number): void {
    this.cargando = true;
    this.proveedorService.findById(id).subscribe({
      next: (proveedor) => {
        this.form.patchValue(proveedor);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar el proveedor',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        }).then(() => this.router.navigate(['/admin/proveedores']));
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
    const datos = this.form.value as Proveedor;

    const request$ = this.editando && this.idProveedor
      ? this.proveedorService.update(this.idProveedor, datos)
      : this.proveedorService.save(datos);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.editando ? 'Proveedor actualizado' : 'Proveedor creado',
          showConfirmButton: false,
          timer: 2200,
        });
        this.router.navigate(['/admin/proveedores']);
      },
      error: () => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el proveedor',
          text: 'Verifica los datos e intenta nuevamente.',
          confirmButtonColor: '#7C2D3B',
          heightAuto: false,
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/proveedores']);
  }
}
