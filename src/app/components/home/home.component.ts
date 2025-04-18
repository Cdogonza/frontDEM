import { Component, OnInit } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { DatePipe } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForTallerComponent } from '../for-taller/for-taller.component';
import { TallerService } from '../../services/taller.service';
import { TallerComponent } from '../taller/taller.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgFor, NgIf, CommonModule, MatIconModule, HttpClientModule, NavBarComponent, RouterModule, ForTallerComponent],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  equipos: any[] = [];
  equiposFiltrados: any[] = [];
  showForm: boolean = false;
  loggedUser: User | null = null; // Usuario logueado
  constructor(private equiposService: EquiposService, private cdr: ChangeDetectorRef, private tallerService: TallerService, private authService: AuthService, private router: Router) { }
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.loggedUser = this.authService.getLoggedUser();
    this.equiposService.formVisibilityy$.subscribe(visible => {
      this.showForm = visible;
    });
  }

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }

  filtrarDEM(event: Event) {

    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.equiposFiltrados = this.equipos.filter(item =>
      item.dem.includes(textoBusqueda)
    );
  }
  filtrarNombre(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value.toUpperCase();
    this.equiposFiltrados = this.equipos.filter(item =>
      item.nombre.includes(textoBusqueda)
    );
  }
  filtrarServicio(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value.toUpperCase();
    this.equiposFiltrados = this.equipos.filter(item =>
      item.servicio.includes(textoBusqueda)
    );
  }
  filtrarUbicacion(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value.toUpperCase();
    this.equiposFiltrados = this.equipos.filter(item =>
      item.ubicacion.includes(textoBusqueda)
    );
  }
  filtrarMarca(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value.toUpperCase();
    this.equiposFiltrados = this.equipos.filter(item =>
      item.marca.includes(textoBusqueda)
    );
  }
  filtrarSerie(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value.toUpperCase();
    this.equiposFiltrados = this.equipos.filter(item =>
      item.serie.includes(textoBusqueda)
    );
  }
  async loadEquipos() {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
      this.equiposFiltrados = data;

    });
  }
  handleButtonClick(DEM: number): void {
    // console.log(DEM);
    // TallerComponent.dem = DEM;
    this.tallerService.showForm();

  }

  closeForm() {
    this.tallerService.hideForm();
  }
  openForm() {
    this.tallerService.showForm();

  }
}