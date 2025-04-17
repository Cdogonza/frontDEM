import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../envairoment';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  imports: [NgIf, ReactiveFormsModule, RouterModule],
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  message: string = '';
  error: string = '';
 urll = environment.apiUrl; // URL de la API desde el archivo de entorno
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.http.post<{ message: string }>(this.urll+'/auth/change-password', this.changePasswordForm.value, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté almacenado
        }
      }).subscribe(
        response => {
          this.message = response.message;
          this.error = '';
          this.changePasswordForm.reset(); // Reiniciar el formulario
          // Cerrar sesión y redirigir al login
          localStorage.removeItem('token'); // Eliminar el token
          this.router.navigate(['/login']); // Redirigir al login
        },
        error => {
          this.error = error.error.message || 'Error en el servidor';
          this.message = '';
        }
      );
    }
  }
  onCancel() {
    this.router.navigate(['./novedades']); // Volver a la pantalla anterior
  }
}