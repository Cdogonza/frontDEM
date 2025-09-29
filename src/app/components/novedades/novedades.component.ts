import { Component, OnInit } from '@angular/core';
import { NovedadesService } from '../../services/novedades.service';
import { DocumentosService } from '../../services/documentos.service';
import { DatePipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NovedadFormComponent } from '../../novedad-form/novedad-form.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user'; 
import { Router } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { DocumentosComponent } from '../documentos/documentos.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { MatButtonModule } from "@angular/material/button"
import { FormsModule } from "@angular/forms"
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-novedades',
  imports: [DocumentosComponent,NgFor,CommonModule,MatIconModule,HttpClientModule,
    NavBarComponent,RouterModule,NovedadFormComponent,MatSlideToggleModule,MatButtonModule,MatCardModule,MatDividerModule,FormsModule],
  providers: [NgModel,DatePipe],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent implements OnInit {
  showForm: boolean = false;
  showDocumentosForm: boolean = false;
  novedades: any[] = [];
  novedadesFiltrados: any[] = [];
  documentos: any[] = [];
  documentosFiltrados: any[] = [];
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = this.datePipe.transform(this.fecha, 'yyyy-MM-dd') || '';
  loggedUser : User | null = null; // Usuario logueado
  dynamicColor = 'blue'; // Puedes cambiarlo dinámicamente
  verDoc:boolean = false;
  isEnabled = false
  log: string[] = []
  
  // Propiedades para paginación
  itemsPerPage: number = 10;
  currentPageNovedades: number = 1;
  currentPageDocumentos: number = 1;
  totalPagesNovedades: number = 0;
  totalPagesDocumentos: number = 0;
  novedadesPaginados: any[] = [];
  documentosPaginados: any[] = [];
  onToggleChange(event: any): void {
    this.verDocumentos();
  }

  onSwitchChange() {
    if (this.verDoc) {
      console.log("Novedades activadas");

    } else {
      console.log("Novedades desactivadas");

    }
  }

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
  constructor(private documentosService:DocumentosService,private novedadesService: NovedadesService,private cdr: ChangeDetectorRef,private authService: AuthService,private router: Router) {
      this.authService.startSessionTimer();
   }

   verDocumentos(){
    if(this.verDoc){
      this.verDoc = false;
    }else{
      this.verDoc = true;
    }
   }
  

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
  ingEquipo() {
    this.router.navigate(['/secretaria']);
  }
  ngOnInit(): void {

    this.loggedUser  = this.authService.getLoggedUser (); // Obtener el usuario logueado
    this.loadNovedadesHoy();
    
    this.loadDocumentos();
    this.novedadesService.formVisibility$.subscribe(visible => {
      this.showForm = visible;
    });
    this.documentosService.formVisibility$.subscribe(visible => {
      this.showDocumentosForm = visible;
    });
  }
  closeForm() {
    this.novedadesService.hideForm();
    this.loadNovedadesHoy();
  }
  closeDocumentosForm() {
    this.documentosService.hideForm();
    this.loadDocumentos();

  }
nuevaNovedad() {
  this.loadNovedadesHoy();
 

}
  async loadNovedadesHoy() {
    this.novedadesService.getNovedadesHoy().subscribe(data => {
      this.novedades = data;
      this.novedadesFiltrados = data;
      this.currentPageNovedades = 1;
      this.updateNovedadesPagination();
      this.cdr.detectChanges();
    });
  }
  
  async loadNovedadesTodas() {
    this.novedadesService.getNovedadesTodas().subscribe(data => {
      this.novedades = data;
      this.novedadesFiltrados = data;
      this.currentPageNovedades = 1;
      this.updateNovedadesPagination();
      this.cdr.detectChanges();
    });
  }
  
  async loadDocumentos() {
    this.documentosService.getDocumentos().subscribe(data => {
      this.documentos = data;
      this.documentosFiltrados = data;
      this.currentPageDocumentos = 1;
      this.updateDocumentosPagination();
      this.cdr.detectChanges();
    });
  }

  // Métodos de paginación para novedades
  updateNovedadesPagination(): void {
    this.totalPagesNovedades = Math.ceil(this.novedadesFiltrados.length / this.itemsPerPage);
    const startIndex = (this.currentPageNovedades - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.novedadesPaginados = this.novedadesFiltrados.slice(startIndex, endIndex);
  }

  // Métodos de paginación para documentos
  updateDocumentosPagination(): void {
    this.totalPagesDocumentos = Math.ceil(this.documentosFiltrados.length / this.itemsPerPage);
    const startIndex = (this.currentPageDocumentos - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.documentosPaginados = this.documentosFiltrados.slice(startIndex, endIndex);
  }

  // Navegación de páginas para novedades
  goToPageNovedades(page: number): void {
    if (page >= 1 && page <= this.totalPagesNovedades) {
      this.currentPageNovedades = page;
      this.updateNovedadesPagination();
    }
  }

  // Navegación de páginas para documentos
  goToPageDocumentos(page: number): void {
    if (page >= 1 && page <= this.totalPagesDocumentos) {
      this.currentPageDocumentos = page;
      this.updateDocumentosPagination();
    }
  }

  // Métodos para obtener arrays de páginas para mostrar en los controles
  getNovedadesPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPagesNovedades; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDocumentosPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPagesDocumentos; i++) {
      pages.push(i);
    }
    return pages;
  }
  filtrarNombre(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.novedadesFiltrados = this.novedades.filter(item =>
      item.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    this.currentPageNovedades = 1;
    this.updateNovedadesPagination();
  }

  filtrarDocumento(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.documentosFiltrados = this.documentos.filter(item =>
      item.documento.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    this.currentPageDocumentos = 1;
    this.updateDocumentosPagination();
  }

  filtrarAsunto(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.documentosFiltrados = this.documentos.filter(item =>
      item.asunto.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    this.currentPageDocumentos = 1;
    this.updateDocumentosPagination();
  }

  filtrarNovedad(event: Event) {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.novedadesFiltrados = this.novedades.filter(item =>
      item.novedad.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    this.currentPageNovedades = 1;
    this.updateNovedadesPagination();
  }
openNovedadForm() {
  this.novedadesService.showForm();
}
openDocumentosForm() {
  this.documentosService.showForm();
}


resetPassword() {
  this.router.navigate(['/change-password']);
}

}




