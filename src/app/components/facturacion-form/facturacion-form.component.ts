import { Component, EventEmitter, Output,OnInit } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Facturacion } from '../../models/Facturacion';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-facturacion-form',
  templateUrl: './facturacion-form.component.html',
  styleUrls: ['./facturacion-form.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class FacturacionFormComponent implements OnInit {
  @Output() closeForm = new EventEmitter<void>(); // Evento para cerrar el formulario
  factura: Facturacion = {
    idfacturacion: 0,
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    empresa: '',
    monto: 0,
    estado: 'Pendiente',
    observacion: ''
  };
  modoEdicion: boolean = false;
  item: Facturacion | undefined;

  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = '';

  constructor(private facturacionService: FacturacionService,private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };
    
    if (state && state.data) {
      this.modoEdicion = true;
      this.factura = state.data; // Precarga los datos en el formulario
    }
  }
  ngOnInit() {
    // Recupera los datos del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };

    console.log(this.modoEdicion);
    if (state?.data) {
      
      this.modoEdicion = true;
      this.item = { ...state.data,
        fecha: this.formatDateForInput(state.data.fecha)
       }; // Copia los datos para evitar mutaciones

    } else {
      this.inicializarItemVacio(); // Si es modo "creación"
    }
  }
  private formatDateForInput(dateValue: string | Date): string {
    if (!dateValue) return '';
    
    // Si es string en formato ISO (2025-04-03T03:00:00.000Z)
    if (typeof dateValue === 'string') {
      return dateValue.split('T')[0];
    }
    
    // Si es objeto Date
    if (dateValue instanceof Date) {
      return formatDate(dateValue, 'yyyy-MM-dd', 'en-US');
    }
    
    return '';
  }

  private inicializarItemVacio() {
    this.item = {
      idfacturacion: 0,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
      empresa: '',
      monto: 0,
      estado: 'Pendiente',
      observacion: ''
    };
  }

  onSubmit(): void {
    if (this.modoEdicion) {
     this.facturacionService.actualizarFacturacion(this.factura).subscribe(
        (response) => {
          console.log('Factura actualizada:', response);
          this.router.navigate(['/facturacion']);
        },
        (error) => {
          console.error('Error al actualizar la factura:', error);
        }
      );
    } else {
      this.facturacionService.crearFacturacion(this.factura).subscribe(
        (response) => {
          console.log('Factura creada:', response);
          
          this.closeForm.emit(); // Cierra el formulario después de guardar
        },
        (error) => {
          console.error('Error al crear la factura:', error);
        }
      );
 
  }
}

  onCancel(): void {
    this.closeForm.emit(); // Cierra el formulario sin guardar
    this.router.navigate(['/facturacion']);
  }
}