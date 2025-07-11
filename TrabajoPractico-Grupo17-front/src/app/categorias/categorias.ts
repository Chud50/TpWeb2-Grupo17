import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../api/services/auth/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent {
  
  categorias = [
    {
      id: 'remeras',
      nombre: 'REMERAS',
      descripcion: 'Descubrí nuestra colección de remeras urbanas',
      imagen: 'assets/remera.jpg',
      clasificacion: 'Remeras'
    },
    {
      id: 'pantalones',
      nombre: 'PANTALONES',
      descripcion: 'Jeans y pantalones para todos los estilos',
      imagen: 'assets/jean.jpg',
      clasificacion: 'Pantalones'
    },
    {
      id: 'buzos',
      nombre: 'BUZOS',
      descripcion: 'Buzos cómodos para el día a día',
      imagen: 'assets/buzo.jpg',
      clasificacion: 'Buzos'
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegarAProductos(categoria?: string) {
    if (categoria) {
      // Navegar a productos con filtro de categoría
      this.router.navigate(['/productos'], { 
        queryParams: { categoria: categoria } 
      });
    } else {
      // Navegar a todos los productos
      this.router.navigate(['/productos']);
    }
  }

  navegarACarrito() {
    this.router.navigate(['/carrito']);
  }
}
