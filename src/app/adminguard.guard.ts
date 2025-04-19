import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';



interface JwtPayload {
  username: string;
  // otras propiedades que pueda tener tu token
}
export const adminguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Obtener el token del localStorage
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Verificar el token obtenido
  if (!token) {
    // No hay token, redirigir a login
    return router.navigate(['/api/auth/login']); // Redirigir al login
  }
  
  try {
    // 2. Decodificar el token JWT
    const decoded = jwtDecode<JwtPayload>(token);
    const username = decoded.username;
    // Verificar el username decodificado
    // 3. Obtener los usuarios autorizados de la ruta (data del router)
    const allowedUsernames = route.data['allowedUsernames'] as string[];
    
    // 4. Verificar si el usuario está autorizado
    if (allowedUsernames && allowedUsernames.includes(username)) {
      return true;
    } 
    return router.createUrlTree(['/unauthorized'], {
      queryParams: { 
        message: `Usuario ${username} no tiene permisos para acceder a esta sección`,
        attemptedUrl: state.url
      }
    });
  } catch (error) {
    return router.createUrlTree(['/login'], {
      queryParams: { message: 'Sesión inválida o expirada' }
    });
  }
};