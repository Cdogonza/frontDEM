import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Facturacion } from '../../models/Facturacion';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
import { FacturacionFormComponent } from '../facturacion-form/facturacion-form.component';
import { EntradaFormComponent } from '../entrada-form/entrada-form.component';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import 'jspdf-autotable';
@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NavBarComponent,
    NgIf,
    FacturacionFormComponent,
    EntradaFormComponent
  ],
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  mostrarForm = false; // Controla la visibilidad del formulario
  mostrarFormEntrada = false;
  facturaciones: Facturacion[] = [];
  filteredFacturaciones: Facturacion[] = []; // Filas sin "pagado"
  pagadasFacturaciones: Facturacion[] = []; // Filas sin "pendiente"
  totalPendiente: string = ""; // Total de facturaciones pendientes
  totalPagado: string = ""; // Total de facturaciones pendientes
  totalEntrada: string = ""; // Total de facturaciones pendientes
  enCaja: string = ""; // Total de facturaciones pendientes
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = this.datePipe.transform(this.fecha, 'yyyy-MM-dd') || '';

  constructor(private facturacionService: FacturacionService) {
    
   }


  ngOnInit(): void {
    this.totalEnCaja();
    this.cargarFacturaciones();
    this.getTotalPendiente();
    this.getTotalPagado();
    this.getTotalEntrada();
  }

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
  imprimirPantalla(): void {
    window.print(); // Abre el diálogo de impresión del navegador
  }
  mostrarFormulario(): void {
    this.mostrarForm = true; // Muestra el formulario
  }
  mostrarFormularioEntrada(): void {
    this.mostrarFormEntrada = true; // Muestra el formulario
  }

  getTotalPendiente(): void {
    this.facturacionService.getTotalPendiente().subscribe(
      (data: number) => {
        const jsonString = JSON.stringify(data); // Convierte el objeto a string
        console.log('String JSON:', jsonString); // Depuración

        const parsedObject = JSON.parse(jsonString); // Convierte el string de vuelta a objeto
        this.totalPendiente = parsedObject.total.toString(); // Extrae el valor de `total` // Extrae el valor de `total`
      },
      (error) => {
        console.error('Error al obtener el total pendiente', error);
        this.totalPendiente = 'Error al cargar el total pendiente';
      }
    );
  }
  getTotalPagado(): void {
    this.facturacionService.getTotalPagado().subscribe(
      (data: number) => {
        const jsonString = JSON.stringify(data); // Convierte el objeto a string
        console.log('String JSON:', jsonString); // Depuración

        const parsedObject = JSON.parse(jsonString); // Convierte el string de vuelta a objeto
        this.totalPagado = parsedObject.total.toString(); // Extrae el valor de `total` // Extrae el valor de `total`
      },
      (error) => {
        console.error('Error al obtener el total pendiente', error);
        this.totalPagado = 'Error al cargar el total pendiente';
      }
    );
  }
  getTotalEntrada(): void {
    this.facturacionService.getTotalEntrada().subscribe(
      (data: number) => {
        const jsonString = JSON.stringify(data); // Convierte el objeto a string
        console.log('String JSON:', jsonString); // Depuración

        const parsedObject = JSON.parse(jsonString); // Convierte el string de vuelta a objeto
        this.totalEntrada = parsedObject.total.toString(); // Extrae el valor de `total` // Extrae el valor de `total`
      },
      (error) => {
        console.error('Error al obtener el total entrada', error);
        this.totalEntrada = 'Error al cargar el total entrada';
      }
    );
  }
  ocultarFormulario(): void {
    this.mostrarForm = false; // Oculta el formulario
    this.totalEnCaja();
    this.cargarFacturaciones(); // Recarga la lista de facturaciones
    this.totalEnCaja();
  }
  ocultarFormularioEntrada(): void {
    this.mostrarFormEntrada = false; // Oculta el formulario
    this.totalEnCaja();
    this.cargarFacturaciones(); // Recarga la lista de facturaciones
    this.totalEnCaja();
  }
   cargarFacturaciones(): void {
    this.totalEnCaja();
    this.facturacionService.obtenerFacturaciones().subscribe(
      (data: Facturacion[]) => {
        this.facturaciones = data;
     
        // Filtra las filas sin "pagado"
        this.filteredFacturaciones = this.facturaciones.filter(
          (facturacion) => facturacion.estado.toLowerCase() !== 'pagado'
        );
        // Filtra las filas sin "pendiente"
        this.pagadasFacturaciones = this.facturaciones.filter(
          (facturacion) => !facturacion.estado.toLowerCase().includes('pendiente')
        );
        this.getTotalPendiente();
        this.getTotalPagado();
        this.getTotalEntrada();
      },
      (error) => {
        console.error('Error al cargar las facturaciones', error);
      }
    );
  }

  moveClick(facturacion: Facturacion): void {
    // Muestra el indicador de carga
    Loading.standard('Cargando...');

    // Llama al servicio para actualizar el estado
    this.facturacionService.updateEstado(facturacion.idfacturacion).subscribe(
      (data: Facturacion) => {
        // Oculta el indicador de carga cuando la operación es exitosa
        Loading.remove();

        // Muestra una notificación de éxito
        Notify.success('Estado Actualizado');

        // Recarga la lista de facturaciones

        this.cargarFacturaciones();

      },
      (error) => {
        // Oculta el indicador de carga en caso de error
        Loading.remove();

        // Muestra una notificación de error
        Notify.failure('Error al actualizar el estado');

        // Registra el error en la consola para depuración
        console.error('Error al actualizar el estado:', error);
      }
    );
  }
  deleteAction(facturacion: Facturacion): void {
    // Muestra un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { // Si el usuario confirma
        this.facturacionService.eliminarFacturacion(facturacion.idfacturacion).subscribe(
          () => {
            Swal.fire('¡Eliminado!', 'La facturación ha sido eliminada.', 'success'); // Notificación de éxito
            this.cargarFacturaciones(); // Recarga la lista de facturaciones
            this.totalEnCaja();
          },
          (error) => {
            console.error('Error al eliminar la facturación:', error); // Depuración
            Swal.fire('Error', 'No se pudo eliminar la facturación.', 'error'); // Notificación de error
          }
        );
      }
    });
  }
  editAction(facturacion: Facturacion): void {

  }

  totalEnCaja(): void {

    this.facturacionService.getTotalCaja().subscribe(
      (data: number) => {
        const jsonString = JSON.stringify(data); // Convierte el objeto a string
        console.log('Caja:', jsonString); // Depuración

        const parsedObject = JSON.parse(jsonString); // Convierte el string de vuelta a objeto
        this.enCaja = parsedObject.total.toString(); // Extrae el valor de `total` // Extrae el valor de `total`
      },
      (error) => {
        console.error('Error al obtener el total caja', error);
        this.enCaja = 'Error al cargar el total caja';
      }
    );
  }

}