import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CajaService } from '../../../services/caja.service';
import { Caja } from '../../../model/caja';
import { EstadoCaja } from '../../../model/enums';
import { TokenService } from '../../../services/token.service';

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
  esAdmin = false;

  constructor(
    private cajaService: CajaService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.tokenService.isAdmin();
    this.cargarCajaAbierta();
    this.cargarCajas();
  }

  cargarCajaAbierta(): void {
    this.cajaService.getCajaAbierta().subscribe({
      next: (data) => this.cajaAbierta = data ?? undefined,
      error: () => this.cajaAbierta = undefined
    });
  }

  cargarCajas(): void {
    this.cargando = true;
    this.cajaService.listarCajas().subscribe({
      next: (data) => {
        this.cajas = data.sort((a, b) =>
          new Date(b.fechaApertura).getTime() - new Date(a.fechaApertura).getTime());
        this.cargando = false;
      },
      error: () => this.cargando = false
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

  nombreVendedor(caja: Caja): string {
    if (!caja.usuario) return '—';
    return caja.usuario.nombreCompleto || caja.usuario.username;
  }
  formatMoney(v: number | undefined): string {
    return `S/ ${(v ?? 0).toFixed(2)}`;
  }
}
