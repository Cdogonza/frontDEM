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
  entradasDelMes: Entrada[] = []; // Entradas filtradas por mes
  facturasPagasDelMes: Facturacion[] = []; // Facturas pagas filtradas por mes
  totalPagado: string = ""; // Total de facturaciones pendientes
  totalEntrada: string = ""; // Total de facturaciones pendientes
  totalEntradasMes: string = ""; // Total de entradas del mes
  totalFacturasPagasMes: string = ""; // Total de facturas pagas del mes
  enCaja: string = ""; // Total de facturaciones pendientes
  fecha = new Date();
  datePipe: DatePipe = new DatePipe('en-US');
  fechaHoy: string = this.datePipe.transform(this.fecha, 'yyyy-MM-dd') || '';
  meses: string[] = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  mesSeleccionado: string = '';
  mesSeleccionadoNumero: number = 0;
  Number = Number; // Make Number available in template
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
    this.mesSeleccionadoNumero = this.obtenerNumeroMes(this.mesSeleccionado);
    this.filtrarDatosPorMes();
  }

  obtenerNumeroMes(mes: string): number {
    const mesesMap: { [key: string]: number } = {
      'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
      'JULIO': 7, 'AGOSTO': 8, 'SETIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
    };
    return mesesMap[mes] || 0;
  }

  filtrarDatosPorMes(): void {
    if (this.mesSeleccionadoNumero === 0) return;

    // Filtrar entradas del mes seleccionado
    this.entradasDelMes = this.entrada.filter(entrada => {
      const fechaEntrada = new Date(entrada.fecha);
      return fechaEntrada.getMonth() + 1 === this.mesSeleccionadoNumero;
    });

    // Filtrar facturas pagas del mes seleccionado
    this.facturasPagasDelMes = this.pagadasFacturaciones.filter(factura => {
      const fechaFactura = new Date(factura.fecha);
      return fechaFactura.getMonth() + 1 === this.mesSeleccionadoNumero;
    });

    // Calcular totales del mes
    this.calcularTotalesDelMes();
  }

  calcularTotalesDelMes(): void {
    // Total de entradas del mes
    const totalEntradas = this.entradasDelMes.reduce((sum, entrada) => sum + Number(entrada.monto), 0);
    this.totalEntradasMes = totalEntradas.toFixed(2);

    // Total de facturas pagas del mes
    const totalFacturas = this.facturasPagasDelMes.reduce((sum, factura) => sum + Number(factura.monto), 0);
    this.totalFacturasPagasMes = totalFacturas.toFixed(2);
  }
  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
exportPDF() {
  if (!this.mesSeleccionado) {
    alert('Por favor, seleccione un mes antes de generar el reporte.');
    return;
  }

  const data = document.getElementById('content');
  if (!data) {
    alert('No se pudo generar el reporte. Intente nuevamente.');
    return;
  }

  // Mostrar indicador de carga
  Loading.init({
    backgroundColor: 'rgba(0,0,0,0.8)',
    messageColor: '#fff',
    messageFontSize: '16px'
  });
  Loading.standard('Generando reporte PDF...');

  html2canvas(data, {
    scale: 2, // Mejor calidad
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    Loading.remove();
    
    // Cambiar la orientación a horizontal ('l' en lugar de 'p')
    const pdf = new jsPDF.jsPDF('l', 'mm', 'a4'); // 'l' = landscape (horizontal)
    
    // Ajustar dimensiones para orientación horizontal
    const imgWidth = 297; // Ancho de A4 en mm (297mm para horizontal)
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    const contentDataURL = canvas.toDataURL('image/png');
    const position = 1;
    
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    
    // Generar nombre del archivo con fecha
    const fecha = new Date();
    const fechaStr = fecha.getFullYear() + '-' + 
                    String(fecha.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(fecha.getDate()).padStart(2, '0');
    const nombreArchivo = `Reporte_Fondo_Rotatorio_${this.mesSeleccionado}_${fechaStr}.pdf`;
    
    pdf.save(nombreArchivo);
    
    // Mostrar mensaje de éxito
    Notify.success('Reporte generado exitosamente');
  }).catch(error => {
    Loading.remove();
    console.error('Error al generar PDF:', error);
    Notify.failure('Error al generar el reporte PDF');
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
