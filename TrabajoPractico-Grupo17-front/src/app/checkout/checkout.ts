import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../api/services/carrito/carrito.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // Limpiar el carrito cuando se finaliza la compra
    this.carritoService.limpiarCarrito();
  }

  seguirComprando() {
    // Navegar a productos sin preservar filtros (empezar de cero)
    this.router.navigate(['/productos']);
  }
}
