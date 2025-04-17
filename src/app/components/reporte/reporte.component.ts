import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { Facturacion } from '../../models/Facturacion';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Entrada } from '../../models/Entrada';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reporte',
  imports: [CommonModule,
      NgFor,
      ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit{
  
  facturaciones: Facturacion[] = [];
  entrada: Entrada[] = [];
  filteredFacturaciones: Facturacion[] = []; // Filas sin "pagado"
  pagadasFacturaciones: Facturacion[] = []; // Filas sin "pendiente"
  totalPagado: string = ""; // Total de facturaciones pendientes
  totalEntrada: string = ""; // Total de facturaciones pendientes
  enCaja: string = ""; // Total de facturaciones pendientes
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = this.datePipe.transform(this.fecha, 'yyyy-MM-dd') || '';
  meses: string[] = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  mesSeleccionado: string = '';
  constructor(private facturacionService: FacturacionService,private router: Router) {
    
   }
   ngOnInit(): void {
    this.totalEnCaja();
    this.cargarFacturaciones();
    this.getTotalPagado();
    this.getTotalEntrada();
    this.cargarEntradas();
  }
  cambiarMes(event: any) {
    this.mesSeleccionado = event.target.value;
  }
  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
exportPDF() {
  const data = document.getElementById('content');
  html2canvas(data!).then(canvas => {
    // Cambiar la orientación a horizontal ('l' en lugar de 'p')
    const pdf = new jsPDF.jsPDF('l', 'mm', 'a4'); // 'l' = landscape (horizontal)
    
    // Ajustar dimensiones para orientación horizontal
    const imgWidth = 297; // Ancho de A4 en mm (297mm para horizontal)
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    const contentDataURL = canvas.toDataURL('image/png');
    const position = 1;
    
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save(this.mesSeleccionado + '.pdf');
  });
}
cancelarReporte(): void {
  this.router.navigate(['/facturacion']); 
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
      const parsedObject = JSON.parse(jsonString); // Convierte el string de vuelta a objeto
      this.totalEntrada = parsedObject.total.toString(); // Extrae el valor de `total` // Extrae el valor de `total`
    },
    (error) => {
      this.totalEntrada = 'Error al cargar el total entrada';
    }
  );
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
      this.getTotalPagado();
      this.getTotalEntrada();
    },
    (error) => {
      console.error('Error al cargar las facturaciones', error);
    }
  );
}
cargarEntradas(): void {
  this.totalEnCaja();
  this.facturacionService.obtenerEntradas().subscribe(
    (data: Entrada[]) => {
      this.entrada = data;
      this.getTotalPagado();
      this.getTotalEntrada();
    },
    (error) => {
      console.error('Error al cargar las facturaciones', error);
    }
  );
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
