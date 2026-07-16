import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CajaService } from '../../../services/caja.service';
import { Caja } from '../../../model/caja';
import { EstadoCaja } from '../../../model/enums';

@Component({
  selector: 'app-caja-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caja-list.component.html'
})
export class CajaListComponent implements OnInit {
  cajas: Caja[] = [];
  cajaAbierta: Caja | undefined;
  estadoCaja = EstadoCaja;
  cargando = true;

  constructor(private cajaService: CajaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCajas();
  }

  cargarCajas(): void {
    this.cargando = true;
    this.cajaService.findAll().subscribe({
      next: (data) => {
        this.cajas = data.sort((a, b) =>
          new Date(b.fechaApertura).getTime() - new Date(a.fechaApertura).getTime()
        );
        this.cajaAbierta = this.cajas.find(c => c.estadoCaja === EstadoCaja.ABIERTA);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  irAApertura(): void {
    this.router.navigate(['/admin/caja/apertura']);
  }

  irACierre(): void {
    if (this.cajaAbierta) {
      this.router.navigate(['/admin/caja/cierre', this.cajaAbierta.idCaja]);
    }
  }

  formatMoney(v: number | undefined): string {
    return `S/ ${(v ?? 0).toFixed(2)}`;
  }
}
