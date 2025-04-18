import { Component, OnInit } from '@angular/core';
import { NovedadesService } from '../../services/novedades.service';
import { DatePipe } from '@angular/common';
import { NgFor,NgStyle } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NovedadFormComponent } from '../../novedad-form/novedad-form.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user'; 
import { Router } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
@Component({
  selector: 'app-novedades',
  imports: [NgFor,CommonModule,MatIconModule,HttpClientModule,NavBarComponent,RouterModule,NovedadFormComponent],
  providers: [DatePipe,],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent implements OnInit {
  showForm: boolean = false;
  novedades: any[] = [];
  novedadesFiltrados: any[] = [];
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = this.datePipe.transform(this.fecha, 'yyyy-MM-dd') || '';

  loggedUser : User | null = null; // Usuario logueado
  

  dynamicColor = 'blue'; // Puedes cambiarlo dinámicamente


  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
  constructor(private novedadesService: NovedadesService,private cdr: ChangeDetectorRef,private authService: AuthService,private router: Router) {
      this.authService.startSessionTimer();
   }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  ngOnInit(): void {

    this.loggedUser  = this.authService.getLoggedUser (); // Obtener el usuario logueado
    this.loadNovedadesHoy();
    this.novedadesService.formVisibility$.subscribe(visible => {
      this.showForm = visible;
    });
  }
  closeForm() {
    this.novedadesService.hideForm();
    this.loadNovedadesHoy();
  }
nuevaNovedad() {
  this.loadNovedadesHoy();
}
  async loadNovedadesHoy() {
    this.novedadesService.getNovedadesHoy().subscribe(data => {
      this.novedades = data;
      this.novedadesFiltrados = data;
      this.cdr.detectChanges();
    });
  }
  async loadNovedadesTodas() {
    this.novedadesService.getNovedadesTodas().subscribe(data => {
      this.novedades = data;
      this.novedadesFiltrados = data;
      this.cdr.detectChanges();
    });
  }

  filtrarNombre(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.novedadesFiltrados = this.novedades.filter(item =>
      item.nombre.includes(textoBusqueda)
  );
}
filtrarNovedad(event: Event) {
  const textoBusqueda = (event.target as HTMLInputElement).value;
  this.novedadesFiltrados = this.novedades.filter(item =>
    item.novedad.includes(textoBusqueda)
);
}
openNovedadForm() {
  this.novedadesService.showForm();
}
resetPassword() {
  this.router.navigate(['/change-password']);
}

}




