import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../envairoment';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-resetpassword',
  imports: [NgIf,ReactiveFormsModule,RouterModule],
  standalone: true,
  providers: [AuthService],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {

  apiUrl = environment.apiUrl;
  resetForm: FormGroup;
  message: string = '';
  error: string = '';


  constructor(private fb: FormBuilder, private auth:AuthService, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  async onSubmit() {
    if (this.resetForm.valid) {
    this.auth.resetPassword(this.resetForm.value).subscribe(
      (response) => {
        this.message = 'Se ha enviado un correo para restablecer la contraseña.';
        this.router.navigate(['/login']); 
        this.error = '';
        console.log(response);
      },
      (error) => {
        this.error = 'Error al enviar el correo. Inténtalo de nuevo.';
        this.message = '';
        console.error(error);
      }
    );
  } else {
    this.error = 'Por favor, introduce un correo electrónico válido.';
    this.message = '';
    
    }
}
}
