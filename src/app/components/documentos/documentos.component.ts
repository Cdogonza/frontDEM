import { Component,EventEmitter,Output,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentosService } from '../../services/documentos.service';
import { NgClass,NgIf,NgFor } from '@angular/common';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
@Component({
  selector: 'app-documentos',
  imports: [ ReactiveFormsModule,NgIf],
  standalone: true,
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent implements OnInit {

documentoForm: FormGroup;
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
  constructor(private fb: FormBuilder, private documentosService: DocumentosService,private authService: AuthService) {
    this.documentoForm = this.fb.group({
      fecha: [{ value: this.FECHAHOY, disabled: true }, Validators.required],
      nombre: [{ value: this.loggedUser?.username, disabled: true }, Validators.required],
      documento: ['', Validators.required],
      matricula: ['', Validators.required],
      procedencia: ['', Validators.required],
      asunto: ['', Validators.required],
      seccion: ['', Validators.required]
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
    if (this.documentoForm.valid) {
      // Obtener la fecha en formato yyyy-MM-dd
      const fecha = this.documentoForm.value.fecha;
      const nombre = this.loggedUser?.username || '';
      const documento = this.documentoForm.value.documento;
      const matricula = this.documentoForm.value.matricula;
      const procedencia = this.documentoForm.value.procedencia;
      const asunto = this.documentoForm.value.asunto;
      const seccion = this.documentoForm.value.seccion;

      // Crear el objeto deale datos a enviar
      const documentoData = {
        fecha: fecha,
        nombre: nombre,
        documento: documento,
        matricula: matricula,
        procedencia: procedencia,
        asunto: asunto,
        seccion: seccion

      };

      // Enviar los datos al servicio
      this.documentosService.createDocumentos(documentoData).subscribe(
        
        response => {
          if (response) {
            Loading.remove(2000);
            Notify.success('Documentacion añadida');
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