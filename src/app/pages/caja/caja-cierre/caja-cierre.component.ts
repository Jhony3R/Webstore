import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CajaService } from '../../../services/caja.service';
import { Caja } from '../../../model/caja';

@Component({
  selector: 'app-caja-cierre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './caja-cierre.component.html'
})
export class CajaCierreComponent implements OnInit {
  caja?: Caja;
  form: FormGroup;
  guardando = false;
  cargando = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      efectivoContado: [null, [Validators.required, Validators.min(0)]],
      observacionDescuadre: ['']
    });
  }

  ngOnInit(): void {
    this.cajaService.getCajaAbierta().subscribe({
      next: (caja) => {
        if (!caja) {
          this.error = 'No tienes una caja abierta para cerrar.';
          this.cargando = false;
          return;
        }
        this.caja = caja;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información de la caja.';
        this.cargando = false;
      }
    });
  }

  get descuadre(): number {
    if (!this.caja) return 0;
    const contado = this.form.value.efectivoContado ?? 0;
    return +(contado - this.caja.saldoEsperadoEfectivo).toFixed(2);
  }

  get requiereObservacion(): boolean {
    return this.form.value.efectivoContado != null && this.descuadre !== 0;
  }

  guardar(): void {
    if (this.form.invalid || !this.caja) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.requiereObservacion && !this.form.value.observacionDescuadre?.trim()) {
      this.error = 'Debes indicar una observación ya que se detectó un descuadre.';
      return;
    }

    this.guardando = true;
    this.error = '';
    const { efectivoContado, observacionDescuadre } = this.form.value;

    this.cajaService.cerrarCaja(efectivoContado, observacionDescuadre).subscribe({
      next: () => {
        this.cajaService.setMessageChange('Caja cerrada correctamente.');
        this.router.navigate(['/admin/caja']);
      },
      error: (err) => {
        // El backend ya manda un mensaje amigable (CustomErrorResponse.message)
        this.error = err.error?.message ?? 'Ocurrió un error al cerrar la caja. Intenta nuevamente.';
        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/caja']);
  }

  formatMoney(v: number | undefined): string {
    return `S/ ${(v ?? 0).toFixed(2)}`;
  }
}
