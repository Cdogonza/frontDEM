import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ComprasService } from '../../services/compras.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  
    compras: any[] = [];
  comprasOriginales: any[] = [];
  categoriaActual: string = '';
  trimestreActual: string = '';
  cargando: boolean = false;
  showModal: boolean = false;
  equipamientoForm!: FormGroup;
  searchNumero: string = '';
  searchNombre: string = '';
  // Paginación
  currentPage: number = 1;
  pageSize: number = 5;

constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }
  private comprasService = inject(ComprasService);

  ngOnInit(): void {
    this.initForm();
    this.cargarEquipamiento();
  }

  // Items paginados para mostrar en la tabla
  get comprasPagina(): any[] {
    const total = this.totalPages;
    if (this.currentPage > total) {
      this.currentPage = total || 1;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.compras.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.compras.length / this.pageSize));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

    initForm(): void {
    this.equipamientoForm = this.fb.group({
      memo: [''],
      tipo: [''],
      numero: ['sin numero'],
      nombre: [''],
      detalle: [''],
      monto: [''],
      rubro: [''],
      resolucion: [''],
      monto_resol_final: [''],
      trimestre: [''],
      estado: [''],
      obs: [''],
    });
  }
  nuevoEquipamiento(): void {
    this.showModal = true;
    this.equipamientoForm.reset();
  }

  closeModal(): void {
    this.showModal = false;
    this.equipamientoForm.reset();
  }

  submitEquipamiento(): void {
    if (this.equipamientoForm.valid) {
      Loading.dots('Agregando equipamiento...');

      const equipamientoData = this.equipamientoForm.value;
      
      this.comprasService.addEquipamiento(equipamientoData).subscribe({
        next: (response) => {
          Loading.remove();
          Notify.success('Equipamiento agregado exitosamente', {
            position: 'right-top',
            timeout: 3000,
            clickToClose: true,
          });
          this.closeModal();
          this.cargarEquipamiento(); // Recargar la lista
        },
        error: (error) => {
          Loading.remove();
          console.error('Error al agregar equipamiento:', error);
          Notify.failure('Error al agregar equipamiento: ' + (error.error?.message || error.message || 'Error desconocido'), {
            position: 'right-top',
            timeout: 5000,
            clickToClose: true,
          });
        }
      });
    } else {
      Notify.warning('Por favor, complete todos los campos requeridos', {
        position: 'right-top',
        timeout: 3000,
        clickToClose: true,
      });
    }
  }
  cargarEquipamiento(): void {
    console.log('Cargando equipamiento desde el backend...');
    this.cargando = true;
    this.comprasService.getEquipamiento().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        console.log('Tipo de datos:', typeof data);
        console.log('Es array:', Array.isArray(data));
        
        // Debuggear la estructura de los datos
        if (Array.isArray(data) && data.length > 0) {
          console.log('Primer elemento:', data[0]);
          console.log('Propiedades del primer elemento:', Object.keys(data[0]));
          
          // Verificar si los datos tienen la propiedad trimestre
          const primerElemento = data[0];
          if (!primerElemento.hasOwnProperty('trimestre')) {
            console.log('Los datos no tienen propiedad trimestre, agregando datos de ejemplo...');
            // Agregar trimestre a los datos existentes
            const datosConTrimestre = data.map((item, index) => ({
              ...item,
              trimestre: ['primer', 'segundo', 'tercer', 'cuarto'][index % 4]
            }));
            this.compras = datosConTrimestre;
            this.comprasOriginales = datosConTrimestre;
          } else {
            this.compras = data;
            this.comprasOriginales = data;
          }
        } else {
          this.compras = Array.isArray(data) ? data : [];
          this.comprasOriginales = Array.isArray(data) ? data : [];
        }
        this.categoriaActual = 'Equipamiento Medico';
        this.trimestreActual = '';
        this.cargando = false;
        this.currentPage = 1;
        console.log('Compras cargadas:', this.compras.length);
      },
      error: (error) => {
        console.error('Error al cargar equipamiento:', error);
        console.error('Detalles del error:', error.message);
        // En caso de error, mostrar un mensaje al usuario
        this.compras = [];
        this.comprasOriginales = [];
        this.cargando = false;
        this.currentPage = 1;
      }
    });
  }

  filtrarPorTrimestre(trimestre: string): void {
    console.log('Filtrando por trimestre:', trimestre);
    this.cargando = true;
    this.trimestreActual = trimestre;
    
    // Filtrado del lado del frontend hasta que el backend tenga el endpoint
    if (this.comprasOriginales.length > 0) {
      const trimestreCapitalizado = trimestre.charAt(0).toLowerCase() + trimestre.slice(1);
      this.compras = this.comprasOriginales.filter(compra => 
        compra.trimestre === trimestreCapitalizado
      );
      console.log('Datos filtrados localmente:', this.compras);
    } else {
      // Si no hay datos originales, intentar cargar desde el backend
      this.comprasService.getEquipamientobyTrimestre(trimestre).subscribe({
        next: (data) => {
          console.log('Datos filtrados recibidos del backend:', data);
          this.compras = Array.isArray(data) ? data : [];
          this.cargando = false;
          this.currentPage = 1;
        },
        error: (error) => {
          console.error('Error al filtrar por trimestre:', error);
          console.error('Detalles del error:', error.message);
          // En caso de error, mostrar todas las compras
          this.compras = this.comprasOriginales;
          this.cargando = false;
          this.currentPage = 1;
        }
      });
      return;
    }
    
    this.cargando = false;
    this.currentPage = 1;
  }

  mostrarTodos(): void {
    this.compras = this.comprasOriginales;
    this.trimestreActual = '';
    this.currentPage = 1;
  }

  verDetalles(compra: any): void {
  try {
    // Navegar a la página de detalles con solo el ID en la URL
    this.router.navigate(['/detalles-compra', compra.id.toString()]);
  } catch (error) {
    console.error('Error al navegar a detalles:', error);
  }
}

  // Métodos de búsqueda
  buscarPorNumero(): void {
    if (this.searchNumero.trim() === '') {
      // Si el campo está vacío, mostrar todas las compras
      this.compras = this.comprasOriginales;
      this.currentPage = 1;
      return;
    }

    this.cargando = true;
    const numero = this.searchNumero.trim();
    
    this.comprasService.buscarPorNumero(numero).subscribe({
      next: (data) => {
        console.log('Resultados de búsqueda por número:', data);
        this.compras = Array.isArray(data) ? data : [];
        this.cargando = false;
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Error al buscar por número:', error);
        // Fallback: búsqueda local
        this.busquedaLocalPorNumero();
        this.cargando = false;
        this.currentPage = 1;
      }
    });
  }

  buscarPorNombre(): void {
    if (this.searchNombre.trim() === '') {
      // Si el campo está vacío, mostrar todas las compras
      this.compras = this.comprasOriginales;
      this.currentPage = 1;
      return;
    }

    this.cargando = true;
    const nombre = this.searchNombre.trim();
    
    this.comprasService.buscarPorNombre(nombre).subscribe({
      next: (data) => {
        console.log('Resultados de búsqueda por nombre:', data);
        this.compras = Array.isArray(data) ? data : [];
        this.cargando = false;
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Error al buscar por nombre:', error);
        // Fallback: búsqueda local
        this.busquedaLocalPorNombre();
        this.cargando = false;
        this.currentPage = 1;
      }
    });
  }

  // Búsquedas locales como fallback
  private busquedaLocalPorNumero(): void {
    const numero = this.searchNumero.toLowerCase().trim();
    this.compras = this.comprasOriginales.filter(compra => 
      compra.numero && compra.numero.toString().toLowerCase().includes(numero)
    );
  }

  private busquedaLocalPorNombre(): void {
    const nombre = this.searchNombre.toLowerCase().trim();
    this.compras = this.comprasOriginales.filter(compra => 
      compra.nombre && compra.nombre.toLowerCase().includes(nombre)
    );
  }

  // Limpiar búsquedas
  limpiarBusquedas(): void {
    this.searchNumero = '';
    this.searchNombre = '';
    this.compras = this.comprasOriginales;
    this.currentPage = 1;
  }

  // Búsqueda combinada (ambos campos)
  buscarCombinada(): void {
    if (this.searchNumero.trim() === '' && this.searchNombre.trim() === '') {
      this.compras = this.comprasOriginales;
      this.currentPage = 1;
      return;
    }

    this.cargando = true;
    const numero = this.searchNumero.trim();
    const nombre = this.searchNombre.trim();
    
    this.comprasService.buscarCombinada(numero, nombre).subscribe({
      next: (data) => {
        console.log('Resultados de búsqueda combinada:', data);
        this.compras = Array.isArray(data) ? data : [];
        this.cargando = false;
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Error al buscar combinada:', error);
        // Fallback: búsqueda local combinada
        this.busquedaLocalCombinada();
        this.cargando = false;
        this.currentPage = 1;
      }
    });
  }

  private busquedaLocalCombinada(): void {
    const numero = this.searchNumero.toLowerCase().trim();
    const nombre = this.searchNombre.toLowerCase().trim();
    
    this.compras = this.comprasOriginales.filter(compra => {
      const matchNumero = !numero || (compra.numero && compra.numero.toString().toLowerCase().includes(numero));
      const matchNombre = !nombre || (compra.nombre && compra.nombre.toLowerCase().includes(nombre));
      return matchNumero && matchNombre;
    });
  }

  exportarTablaAExcel(): void {
    if (this.compras.length === 0) {
      Notify.warning('No hay datos para exportar', {
        position: 'right-top',
        timeout: 3000,
        clickToClose: true,
      });
      return;
    }

    try {
      Loading.dots('Exportando a Excel...');

      // Preparar los datos para la exportación
      const datosParaExportar = this.compras.map(compra => ({
        'ID': compra.id || 'N/A',
        'Memo': compra.memo || compra.numero || 'N/A',
        'Nombre': compra.nombre || 'N/A',
        'Número de Procedimiento': compra.numero || 'N/A',
        'Monto': compra.monto ? `$${compra.monto.toLocaleString('es-AR')}` : 'N/A',
        'Tipo': compra.tipo || 'N/A',
        'Detalle': compra.detalle || 'N/A',
        'Rubro': compra.rubro || 'N/A',
        'Resolución': compra.resolucion || 'N/A',
        'Monto Resolución Final': compra.monto_resol_final ? `$${compra.monto_resol_final.toLocaleString('es-AR')}` : 'N/A',
        'Trimestre': compra.trimestre || 'N/A',
        'Estado': compra.estado || 'N/A',
        'Observaciones': compra.obs || 'N/A'
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosParaExportar);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 20 }, // Memo
        { wch: 25 }, // Nombre
        { wch: 20 }, // Número de Procedimiento
        { wch: 15 }, // Monto
        { wch: 10 }, // Tipo
        { wch: 30 }, // Detalle
        { wch: 15 }, // Rubro
        { wch: 15 }, // Resolución
        { wch: 20 }, // Monto Resolución Final
        { wch: 15 }, // Trimestre
        { wch: 12 }, // Estado
        { wch: 30 }  // Observaciones
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipamiento');

      // Generar el nombre del archivo con fecha y hora
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const nombreArchivo = `Equipamiento_${fecha}_${hora}.xlsx`;

      // Exportar el archivo
      XLSX.writeFile(workbook, nombreArchivo);

      Loading.remove();
      Notify.success('Archivo Excel exportado correctamente', {
        position: 'right-top',
        timeout: 3000,
        clickToClose: true,
      });
    } catch (error) {
      Loading.remove();
      console.error('Error al exportar a Excel:', error);
      Notify.failure('Error al exportar el archivo Excel. Por favor, intente nuevamente.', {
        position: 'right-top',
        timeout: 5000,
        clickToClose: true,
      });
    }
  }
}
