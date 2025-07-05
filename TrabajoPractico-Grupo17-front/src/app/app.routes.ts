import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProductosComponent } from './productos/productos';
import { RegistroComponent } from './registro/registro';
import { CarritoComponent } from './carrito/carrito';
import { CategoriasComponent } from './categorias/categorias';
import { authGuard } from './api/services/auth/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { 
        path: 'productos', 
        component: ProductosComponent,
       // canActivate: [authGuard]
    },
    { 
        path: 'categorias', 
        component: CategoriasComponent,
       // canActivate: [authGuard]
    },
    { 
        path: 'carrito', 
        component: CarritoComponent,
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
