import { Component,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TallerService } from '../../services/taller.service';
import { NgClass,NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user'; 
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-for-taller',
  imports: [ ReactiveFormsModule,NgIf],
  templateUrl: './for-taller.component.html',
  styleUrl: './for-taller.component.css'
})
export class ForTallerComponent {
  dem:Number=0;
tallerForm: FormGroup;
  showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  FECHAHOY: string = new Date().toISOString().substring(0, 10);
  loggedUser : User | null = null; // Usuario logueado
  constructor(private authService: AuthService,private fb: FormBuilder, private tallerService: TallerService) {
    this.tallerForm = this.fb.group({
      dem: ['', Validators.required],
      fecha: [{ value: new Date().toISOString().substring(0, 10), disabled: true }, Validators.required],
      user: ['', Validators.required],
      motivo: ['', Validators.required],
      estado: ['', Validators.required]
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
    if (this.tallerForm.valid) {
      // Obtener la fecha en formato yyyy-MM-dd
      const dem = this.tallerForm.value.dem;
      const user = this.tallerForm.value.user;
      const motivo = this.tallerForm.value.motivo;
      const estado = this.tallerForm.value.estado;

      // Crear el objeto deale datos a enviar
      const tallerData = {
        dem: dem,
        user: user,
        motivo: motivo,
        estado: estado,
      };

      // Enviar los datos al servicio
      this.tallerService.createTaller(tallerData).subscribe(
        response => {
          
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