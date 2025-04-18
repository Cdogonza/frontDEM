import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar tu servicio de autenticación
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-newpassword',
  imports: [ReactiveFormsModule,NgIf],
  standalone: true,
  providers: [AuthService],
  templateUrl: './newpassword.component.html',
  styleUrl: './newpassword.component.css'
})
export class NewpasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }


  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { password, confirmPassword } = this.resetPasswordForm.value;

    if (password !== confirmPassword) {
      // Manejar error de coincidencia de contraseñas
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.authService.newPassword(this.token!, password).subscribe(
      (response) => {
        // Manejar la respuesta del servidor
        alert('Contraseña restablecida con éxito.');
        this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
      },
      (error) => {
        // Manejar error
        alert('Error al restablecer la contraseña. Inténtalo de nuevo.');
      }
    );
  }

}
