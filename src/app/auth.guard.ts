import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
      // Verificar si estamos en el navegador
      if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
              return true; // El usuario está autenticado
          } else {
              this.router.navigate(['/api/auth/login']); // Redirigir al login
              return false; // El usuario no está autenticado
          }
      }
      return false; // En caso de que no estemos en el navegador
  }
}