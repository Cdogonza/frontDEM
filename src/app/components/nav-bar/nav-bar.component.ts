import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  equipos: any[] = [];
  otro:boolean = true;
  loggedUser : User | null = null; 
  nombre: string = '';
  constructor(private equiposService: EquiposService, private auth:AuthService,private router: Router) { }
  ngOnInit(): void {  
    this.loggedUser  = this.auth.getLoggedUser (); // Obtener el usuario logueado
     this.nombre = this.loggedUser?.username || '';

}
  loadEquipos(): void {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
    });



  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }
  resetPassword() {
    this.router.navigate(['/change-password']);
  }

}
