import { Injectable,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
export interface User {
    id: number;
    username: string;
    email: string;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {
    private logoutTimer: any;
    message: string = '';
    private readonly SESSION_TIMEOUT = 10*60*1000; // 15 minutos
    public loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    constructor(private http: HttpClient,private router: Router) {}


    ngOnInit() {
        this.startSessionTimer();
        }

    startSessionTimer() {
        this.clearSessionTimer();
        console.log('⏳ Temporizador de sesión iniciado');
        this.logoutTimer = setTimeout(() => {
            console.log('⏰ Tiempo agotado, cerrando sesión...');
          this.logout();
          
        }, this.SESSION_TIMEOUT);
      }

      clearSessionTimer() {
        if (this.logoutTimer) {
          clearTimeout(this.logoutTimer);
        }
      }
    //private apiUrl = 'https://back-prueba-dem.onrender.com/auth';

    private apiUrl = 'http://localhost:3000/auth';

    register(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, { username, password });
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { username, password });
    }

    // login(username: string, password: string): Promise<void> {
    //     this.loadingSubject.next(true);
    //     return new Promise((resolve, reject) => {

    //       setTimeout(() => {
    //         this.http.post(`${this.apiUrl}/login`, { username, password }).subscribe(
    //             (response: any) => {
    //                 localStorage.setItem('token', response.token);
    //                 this.router.navigate(['/novedades']);
    //                 this.loadingSubject.next(false);
    //                 resolve();
    //             },
    //             (error) => {
                  
    //                 console.error('Error al iniciar sesión', error);
    //                 this.loadingSubject.next(false);
    //                 reject();
    //             }
    //             );
    //         this.loadingSubject.next(false);
    //         resolve();
    //       }, 7000);
    //     });
    //   }

      
    resetPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { email });
    }


    // Método para obtener el usuario logueado
    getLoggedUser (): User | null {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: User = jwtDecode(token); // Decodificar el token
            return decoded; // Devuelve el payload del token
        }
        return null; // No hay usuario logueado
    }
    logout() {
        console.log('🔴 Cerrando sesión...');
        localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
        this.router.navigate(['/login']);
    }
}