import { Component, EventEmitter, Output } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Facturacion } from '../../models/Facturacion';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturacion-form',
  templateUrl: './facturacion-form.component.html',
  styleUrls: ['./facturacion-form.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class FacturacionFormComponent {
  @Output() closeForm = new EventEmitter<void>(); // Evento para cerrar el formulario
  factura: Facturacion = {
    idfacturacion: 0,
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    empresa: '',
    monto: 0,
    estado: 'Pendiente',
    observacion: ''
  };

  constructor(private facturacionService: FacturacionService) {}

  onSubmit(): void {
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

  onCancel(): void {
    this.closeForm.emit(); // Cierra el formulario sin guardar
  }
}