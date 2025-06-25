import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProductosComponent } from './productos/productos';
import { RegistroComponent } from './registro/registro';
import { CarritoComponent } from './carrito/carrito';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
