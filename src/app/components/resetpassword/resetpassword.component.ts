import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  imports: [NgIf,ReactiveFormsModule,RouterModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {

  resetForm: FormGroup;
  message: string = '';
  error: string = '';


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  async onSubmit() {
    if (this.resetForm.valid) {
      try {
        const response = await this.http.post<{ message: string }>('https://back-prueba-dem.onrender.com/auth/reset-password', this.resetForm.value).toPromise();
        if (response) {
          this.message = response.message;
        } else {
          this.error = 'No response from server';
        }
        this.error = '';
      } catch (error) {
        this.error = (error as any).error.message || 'Error en el servidor';
        this.message = '';
      }
    }
}
}
