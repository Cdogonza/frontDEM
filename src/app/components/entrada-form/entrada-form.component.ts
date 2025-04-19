import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Entrada } from '../../models/Entrada';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrada-form',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './entrada-form.component.html',
  styleUrl: './entrada-form.component.css'
})
export class EntradaFormComponent implements OnInit{

 public static totalCaja: string = "";

  @Output() closeFormEntrada = new EventEmitter<void>(); // Evento para cerrar el formulario
  entrada: Entrada = {
    identrada: 0,
    monto: 0,
    fecha: this.obtenerFechaActual(),
    username: '',
    motivo: ''
  };
  obtenerFechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }
  constructor(private facturacionService: FacturacionService) { 
  }

  ngOnInit(): void {

  }
  getCaja(){
    return EntradaFormComponent.totalCaja;
  }
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
cerrarCaja(){

}

  onCancel(): void {
    this.closeFormEntrada.emit(); // Cierra el formulario sin guardar
  }
}
