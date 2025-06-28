import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../api/services/auth/auth.service';
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

  async onLogin() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    
    try {
      const loginResult = await this.authService.loginAsync(this.email, this.password);
      if (loginResult) {
        this.router.navigate(['/productos']);
      } else {
        this.error = 'Correo o contraseña incorrectos';
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.error = 'Error al conectar con el servidor';
    }
  }

  onRegister() {
    this.router.navigate(['/registro']);
  }
}