import { Injectable,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../envairoment';
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
    private readonly SESSION_TIMEOUT = 30*60*1000; // 15 minutos
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

    private apiUrl = environment.apiUrl; // Cambia esto si es necesario

    register(user:any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`,{user});
    }

    createNovedad(novedad: any): Observable<any> {
      return this.http.post(this.apiUrl, novedad);
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { username, password });
    }


      
    resetPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/reset-password`, { email });
    }
    newPassword(token: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/new-password`, { token, password });
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
        localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento local
        this.router.navigate(['/login']);
    }
    getUsers(): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiUrl}/auth/getUsers`, {});
      }
      createUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/register`, {user});
      }
    
      getUserById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
      }
    
     
    
      updateUser(id: number, user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/update-user/${id}`, {user});  
      }
    
      deleteUser(id: number): Observable<any> {
        return this.http.post<any[]>(`${this.apiUrl}/auth/delete-user`, {id});
      }

}