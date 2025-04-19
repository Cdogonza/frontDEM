// src/app/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="alert alert-danger">
      <h2>Acceso no autorizado</h2>
      <p>{{ message }}</p>
      <p *ngIf="attemptedUrl">Intentaste acceder a: {{ attemptedUrl }}</p>
      <button (click)="goBack()" class="btn btn-danger" >Volver atrás</button>
    </div>
  `,
  styles: [`
    .alert {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
    }
  `]
})
export class UnauthorizedComponent {
  message: string = 'No tienes permisos para acceder a esta página';
  attemptedUrl: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      message?: string;
      attemptedUrl?: string;
    };
    
    if (state?.message) this.message = state.message;
    if (state?.attemptedUrl) this.attemptedUrl = state.attemptedUrl;
  }

  goBack() {
    window.history.back();
  }
}