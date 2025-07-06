import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {

  integrantes = [
    {
      nombre: 'Victoria',
      apellido: 'Junco',
      email: 'vjunco304@alumno.unlam.edu.ar'
    },
    {
      nombre: 'Solange',
      apellido: 'De Bonis',
      email: 'sdebonis@alumno.unlam.edu.ar'
    },
    {
      nombre: 'Pablo',
      apellido: 'Stadtner',
      email: 'pstadtner@alumno.unlam.edu.ar'
    },
    {
      nombre: 'Guido',
      apellido: 'Sersewitz',
      email: 'gsersewitz@alumno.unlam.edu.ar'
    }
  ];

  constructor() {}

  abrirWhatsApp() {
    const numero = '5491123456789'; // Número falso
    const mensaje = 'Hola! Me interesa conocer más sobre los productos de APPI-ROPA';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  abrirInstagram() {
    window.open('https://instagram.com/appi-ropa', '_blank');
  }

  enviarEmail() {
    window.open('mailto:appiropa@gmail.com?subject=Consulta sobre productos APPI-ROPA', '_blank');
  }
}
