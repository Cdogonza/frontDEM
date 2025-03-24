import { Component, EventEmitter, Output } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Entrada } from '../../models/Entrada';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-form',
  imports: [    CommonModule,
    FormsModule],
  templateUrl: './entrada-form.component.html',
  styleUrl: './entrada-form.component.css'
})
export class EntradaFormComponent {

  @Output() closeFormEntrada = new EventEmitter<void>(); // Evento para cerrar el formulario
  entrada: Entrada = {
    idfacturacion: 0,
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    monto: 0,
  };

  constructor(private facturacionService: FacturacionService) {}

  onSubmit(): void {
    this.facturacionService.crearEntrada(this.entrada).subscribe(
      (response) => {
        console.log('Entrada creada:', response);
        
        this.closeFormEntrada.emit(); // Cierra el formulario después de guardar
      },
      (error) => {
        console.error('Error al crear la entrada:', error);
      }
    );
  }

  onCancel(): void {
    this.closeFormEntrada.emit(); // Cierra el formulario sin guardar
  }
}
