import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';


import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [LoadingComponent,ReactiveFormsModule, FormsModule, NgIf, RouterModule],
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    message: string = '';
    localStorage: any;
    isLoading = false;
    constructor(private authService: AuthService, private router: Router) {

        this.authService.loading$.subscribe(loading => {
            this.isLoading = loading;
        });
    }
    login() {

        const loginData = {
            username: this.username,
            password: this.password
        };
        this.authService.loadingSubject.next(true);
        fetch('https://back-prueba-dem.onrender.com/auth/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData) 
        })
            .then(response => {
                if (!response.ok) {
                  
                    throw new Error('Error en la autenticación');
                }
                return response.json(); 
            })
            .then(data => {
                this.authService.loadingSubject.next(false);
                localStorage.setItem('token', data.token);
                console.log('Inicio de sesión exitoso');
                this.router.navigate(['/novedades']);
            })
            .catch(error => {
       
                if (error.message === 'Error en la autenticación') {
                    this.authService.loadingSubject.next(false);
                    this.message = 'Credenciales incorrectas. Inténtalo de nuevo.';
                } else {
                    this.message = 'Ocurrió un error. Por favor, intenta más tarde.';
                }
            });
    }
    // login() {
    //         const loginData = {
    //         username: this.username,
    //         password: this.password
    //     };
    //     this.authService.login(loginData.username, loginData.password).then(() => {
    
    //         this.router.navigate(['/novedades']);
        
    // }).catch(() => {
    //     this.message = 'Credenciales incorrectas. Inténtalo de nuevo.';
    // }
    // );
    //     ;
    //   }
}