import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CajaService } from '../../../services/caja.service';

@Component({
  selector: 'app-caja-apertura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './caja-apertura.component.html'
})
export class CajaAperturaComponent implements OnInit {
  form: FormGroup;
  guardando = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      saldoInicial: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Evita abrir una segunda caja si ya existe una abierta
    this.cajaService.getCajaAbierta().subscribe(caja => {
      if (caja) {
        this.cajaService.setMessageChange('Ya existe una caja abierta. Ciérrala antes de abrir otra.');
        this.router.navigate(['/admin/caja']);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    this.error = '';
    const saldoInicial = this.form.value.saldoInicial;

    this.cajaService.abrirCaja(saldoInicial).subscribe({
      next: () => {
        this.cajaService.setMessageChange('Caja aperturada correctamente.');
        this.router.navigate(['/admin/caja']);
      },
      error: () => {
        this.error = 'Ocurrió un error al aperturar la caja. Intenta nuevamente.';
        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/caja']);
  }
}
