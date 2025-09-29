import { Component, OnInit } from "@angular/core";
import { SecretariaService } from "../../services/secretaria.service";
import { Secretaria } from "../../models/Secretaria";
import { NgIf, NgFor } from "@angular/common";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, map, Observable, of } from "rxjs";
import { Equipos } from "../../models/equipos";
import { User } from "../../services/auth.service";
import { AuthService } from "../../services/auth.service";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
import { PermissionService } from "../../services/permission.service";
@Component({
  selector: "app-secretaria",
  standalone: true,
  imports: [NgIf, NgFor, NavBarComponent, CommonModule, FormsModule],
  providers: [SecretariaService, AuthService],
  templateUrl: "./secretaria.component.html",
  styleUrls: ["./secretaria.component.css"],
})
export class SecretariaComponent implements OnInit {

  secretariaItems: Secretaria[] = []
  equipos: Equipos[] = []
  loading = false
  error: string | null = null
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  searchTerm: any;
  equiposSearch: boolean = false;
  loggedUser: User | null = null; // Usuario logueado
  currentUser: string = '';
  userPermissions: string[] = [];

  constructor(private secretariaService: SecretariaService, private authService: AuthService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.loadSecretariaItems()
    this.loggedUser = this.authService.getLoggedUser(); // Obtener el usuario logueado
    this.currentUser = this.loggedUser?.username || ''; // Obtener el email del usuario logueado
    if (this.currentUser) {
      this.userPermissions = this.permissionService.getUserPermissions(this.currentUser);
      console.log(this.userPermissions);
    } 
  }

  filterItems(): void {
    if (!this.searchTerm) {
      return;
    }
    const id = Number(this.searchTerm);

    this.secretariaService.getSecretariaItem(id).subscribe({
      next: (data) => {
        this.equiposSearch = true
        this.equipos = [data];
        console.log(this.equipos);
      },
      error: (err) => {
        this.error = "Error al cargar los datos";
        this.equiposSearch = true


      }
    });
  }
  reset(): void {
    this.equiposSearch = false;
    this.searchTerm = '';
    this.error = null;
    this.loadSecretariaItems()

  }


  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
  loadSecretariaItems(): void {
    this.loading = true
    this.secretariaService.getSecretariaItems().subscribe({
      next: (data) => {
        this.secretariaItems = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Error al cargar los datos"
        this.loading = false
        console.error(err)
      },
    })
  }

  editItem(id: number): void {
    // Implementar lógica para editar un item
    console.log("Editar item con ID:", id)
  }
  reparar(id: number) {
    if (this.permissionService.hasPermission(this.currentUser, 'tecnico')) {
      Notify.failure('No tienes permiso para cerrar el mes');
      return;
    }

    console.log("Reparar item con ID:", id)
  }
}
