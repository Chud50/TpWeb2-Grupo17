import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../api/services/auth/auth.service';
import { CarritoService } from '../../api/services/carrito/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  @Input() activeRoute: string = '';
  cantidadEnCarrito: number = 0;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private carritoService: CarritoService
  ) {
    // Suscribirse a los cambios del carrito
    this.carritoService.carrito$.subscribe(carrito => {
      this.cantidadEnCarrito = carrito.cantidadTotal;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  isActiveRoute(route: string): boolean {
    return this.activeRoute === route;
  }
}
