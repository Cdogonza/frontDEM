import { Component,EventEmitter,Output,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NovedadesService } from '../services/novedades.service';
import { NgClass,NgIf } from '@angular/common';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
@Component({
  selector: 'app-novedad-form',
  templateUrl: './novedad-form.component.html',
  imports: [ ReactiveFormsModule,NgIf],
  styleUrls: ['./novedad-form.component.css']
})
export class NovedadFormComponent implements OnInit {
  novedadForm: FormGroup;
  showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  //FECHAHOY: string = new Date().toISOString().substring(0, 10);
 
  
  private obtenerFechaHoy(): string {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: string = String(today.getMonth() + 1).padStart(2, '0');
    const day: string = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  FECHAHOY = this.obtenerFechaHoy();
  loggedUser : User | null = null; // Usuario logueado
  constructor(private fb: FormBuilder, private novedadesService: NovedadesService,private authService: AuthService) {
    this.novedadForm = this.fb.group({
      fecha: [{ value: this.FECHAHOY, disabled: true }, Validators.required],
      nombre: [{ value: this.loggedUser?.username, disabled: true }, Validators.required],
      novedad: ['', Validators.required]
    });

  }
ngOnInit(): void {  
    this.loggedUser  = this.authService.getLoggedUser (); // Obtener el usuario logueado
    console.log(this.FECHAHOY);
}
  openModal() {
    this.showModal = true;
  }


  onSubmit() {
    Loading.standard('Cargando...');
    if (this.novedadForm.valid) {
      // Obtener la fecha en formato yyyy-MM-dd
      const fecha = this.novedadForm.value.fecha;
      const nombre = this.loggedUser?.username || '';
      const novedad = this.novedadForm.value.novedad;

      // Crear el objeto deale datos a enviar
      const novedadData = {
        fecha: fecha,
        nombre: nombre,
        novedad: novedad
      };

      // Enviar los datos al servicio
      this.novedadesService.createNovedad(novedadData).subscribe(
        
        response => {
          if (response) {
            Loading.remove(2000);
            Notify.success('Novedad añadida');
          }
          this.close.emit(); // Emitir el evento para cerrar el formulario
          
        },
        error => {
          console.error('Error al crear la novedad:', error);
        }
      );
      
    }
    
  }

  closeModal() {
    this.close.emit(); // Emitir el evento para cerrar el formulario
  }
}