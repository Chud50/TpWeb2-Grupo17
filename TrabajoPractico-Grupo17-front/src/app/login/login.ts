import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  public error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.error = '';
    if (!this.email || !this.password) {
    this.error = 'Por favor, completa todos los campos.';
    return;
    }
    
    if (this.authService.login(this.email, this.password)) {
      // Redirige a la página principal o productos
      this.router.navigate(['/productos']);
    } else {
      this.error = 'Correo o contraseña incorrectos';
    }
  }

  onRegister() {
    this.router.navigate(['/registro']);
  }
}