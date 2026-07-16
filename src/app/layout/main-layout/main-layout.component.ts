import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  rolesPermitidos?: string[]; // si no se define, visible para todos
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  private loginService = inject(LoginService);
  private router = inject(Router);

  sidebarOpen = signal(false); // control para mobile
  username = signal<string>('');
  rol = signal<string>('');

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/admin/home', icon: 'home' },
    { label: 'Ventas', route: '/admin/ventas', icon: 'cart' },
    { label: 'Caja', route: '/admin/caja', icon: 'cash' },
    { label: 'Productos', route: '/admin/productos', icon: 'tag' },
    { label: 'Categorías', route: '/admin/categorias', icon: 'grid' },
    { label: 'Ajuste de inventario', route: '/admin/ajuste-inventario', icon: 'adjust', rolesPermitidos: ['ADMINISTRADOR'] },
    { label: 'Compras', route: '/admin/compras', icon: 'truck' },
    { label: 'Proveedores', route: '/admin/proveedores', icon: 'building' },
    { label: 'Clientes', route: '/admin/clientes', icon: 'users' },
    { label: 'Reportes', route: '/admin/reportes', icon: 'chart' },
    { label: 'Usuarios', route: '/admin/usuarios', icon: 'shield', rolesPermitidos: ['ADMINISTRADOR'] },
  ];

  ngOnInit(): void {
    this.username.set(sessionStorage.getItem('username') || 'Usuario');
    this.rol.set(this.loginService.getRol() || '');
  }

  get visibleNavItems(): NavItem[] {
    return this.navItems.filter(
      (item) => !item.rolesPermitidos || item.rolesPermitidos.includes(this.rol()),
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7C2D3B',
      cancelButtonColor: '#B3AC9C',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.logout();
      }
    });
  }
}
