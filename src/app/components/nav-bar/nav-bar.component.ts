import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user.model'; 
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
  constructor(private equiposService: EquiposService, private auth:AuthService) { }
  ngOnInit(): void {  
    this.loggedUser  = this.auth.getLoggedUser (); // Obtener el usuario logueado
     this.nombre = this.loggedUser?.username || '';

}
  loadEquipos(): void {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
    });



  }


 

}
