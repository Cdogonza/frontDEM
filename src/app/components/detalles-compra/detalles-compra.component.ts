import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComprasService } from '../../services/compras.service';
import { environment } from '../../envairoment';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detalles-compra',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent, FormsModule, ReactiveFormsModule, SafeUrlPipe],
  providers: [ComprasService, FormBuilder],
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.css']
})
export class DetallesCompraComponent implements OnInit {
  
  compra: any = null;
  cargando: boolean = true;
  mostrarFormularioEdicion: boolean = false;
  formularioEdicion!: FormGroup;
  guardando: boolean = false;
  equipos: any[] = [];
  cargandoEquipos: boolean = false;
  id: string = '';
  
  // Propiedades para el formulario de agregar equipo
  mostrarFormularioAgregarEquipo: boolean = false;
  formularioAgregarEquipo!: FormGroup;
  guardandoEquipo: boolean = false;
  
  // Propiedades para el formulario de editar equipo
  mostrarFormularioEditarEquipo: boolean = false;
  formularioEditarEquipo!: FormGroup;
  guardandoEdicionEquipo: boolean = false;
  equipoSeleccionado: any = null;
  
  // Propiedades para anexos
  anexos: any[] = [];
  cargandoAnexos: boolean = false;
  subiendoAnexo: boolean = false;
  archivoSeleccionado: File | null = null;
  
  // Propiedades para preview de documentos
  mostrarPreview: boolean = false;
  documentoPreview: any = null;

  constructor(
     private router: Router,
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private comprasService: ComprasService
  ) { 
    //this.inicializarFormulario();
  }

  ngOnInit(): void {
   this.cargarDetalles();
   this.inicializarFormulario();
   this.inicializarFormularioAgregarEquipo();
   this.inicializarFormularioEditarEquipo();
  }
  cargarDetalles(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      console.log('ID recibido desde URL:', this.id);
      
      if (this.id) {
        this.cargarCompraPorId(this.id);
      } else {
        console.error('No se encontró ID de compra en la URL');
        this.volverACompras();
      }
    });
  }
  cargarCompraPorIdAlternativo(id: string): void {
    this.cargando = true;
    console.log('Usando método alternativo para cargar compra con ID:', id);
    
    // Cargar todas las listas y buscar localmente
    this.comprasService.getEquipamiento().subscribe({
      next: (equipamientos) => {
        console.log('Equipamientos cargados:', equipamientos);
        const compra = Array.isArray(equipamientos) ? 
          equipamientos.find((item: any) => item.id.toString() === id) : null;
        
        if (compra) {
          this.compra = compra;
          this.cargando = false;
          console.log('Compra encontrada en equipamiento (método alternativo):', this.compra);
          this.cargarEquipos();
          this.cargarAnexos();
          return;
        }
        
        // Si no está en equipamiento, buscar en mantenimiento
        this.comprasService.getMantenimiento().subscribe({
          next: (mantenimientos) => {
            console.log('Mantenimientos cargados:', mantenimientos);
            const compraMant = Array.isArray(mantenimientos) ? 
              mantenimientos.find((item: any) => item.id.toString() === id) : null;
            
            if (compraMant) {
              this.compra = compraMant;
              this.cargando = false;
              console.log('Compra encontrada en mantenimiento (método alternativo):', this.compra);
              this.cargarEquipos();
              this.cargarAnexos();
              return;
            }
            
            // Si no está en mantenimiento, buscar en motores
            this.comprasService.getMotores().subscribe({
              next: (motores) => {
                console.log('Motores cargados:', motores);
                const compraMot = Array.isArray(motores) ? 
                  motores.find((item: any) => item.id.toString() === id) : null;
                
                if (compraMot) {
                  this.compra = compraMot;
                  this.cargando = false;
                  console.log('Compra encontrada en motores (método alternativo):', this.compra);
                  this.cargarEquipos();
                  this.cargarAnexos();
                } else {
                  console.error('No se encontró la compra con ID:', id);
                  this.cargando = false;
                  this.volverACompras();
                }
              },
              error: (error) => {
                console.error('Error al cargar motores (método alternativo):', error);
                this.cargando = false;
                this.volverACompras();
              }
            });
          },
          error: (error) => {
            console.error('Error al cargar mantenimiento (método alternativo):', error);
            this.cargando = false;
            this.volverACompras();
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar equipamiento (método alternativo):', error);
        this.cargando = false;
        this.volverACompras();
      }
    });
  }

  cargarCompraPorId(id: string): void {
    this.cargando = true;
    console.log('Intentando cargar compra con ID:', id);
    
    // Timeout para evitar que se quede cargando indefinidamente
    const timeout = setTimeout(() => {
      if (this.cargando) {
        console.log('Timeout alcanzado, intentando método alternativo...');
        this.cargarCompraPorIdAlternativo(id);
      }
    }, 5000); // 5 segundos de timeout
    
    // Intentar cargar desde equipamiento primero
    this.comprasService.getEquipamientoPorId(id).subscribe({
      next: (response) => {
        console.log('Respuesta de equipamiento:', response);
        if (response && response.length > 0) {
          this.compra = response[0]; // Tomar el primer elemento si es un array
        } else if (response && response.id) {
          this.compra = response; // Si es un objeto directo
        } else {
          this.compra = response; // Intentar con la respuesta tal como viene
        }
        
        if (this.compra && this.compra.id) {
          clearTimeout(timeout);
          this.cargando = false;
          console.log('Compra encontrada en equipamiento:', this.compra);
          this.cargarEquipos();
          this.cargarAnexos();
          return;
        }
        
        // Si no está en equipamiento, buscar en mantenimiento
        console.log('No encontrado en equipamiento, buscando en mantenimiento...');
        this.comprasService.getMantenimientoPorId(id).subscribe({
          next: (responseMant) => {
            console.log('Respuesta de mantenimiento:', responseMant);
            if (responseMant && responseMant.length > 0) {
              this.compra = responseMant[0];
            } else if (responseMant && responseMant.id) {
              this.compra = responseMant;
            } else {
              this.compra = responseMant;
            }
            
            if (this.compra && this.compra.id) {
              clearTimeout(timeout);
              this.cargando = false;
              console.log('Compra encontrada en mantenimiento:', this.compra);
              this.cargarEquipos();
              this.cargarAnexos();
              return;
            }
            
            // Si no está en mantenimiento, buscar en motores
            console.log('No encontrado en mantenimiento, buscando en motores...');
            this.comprasService.getMotoresPorId(id).subscribe({
              next: (responseMot) => {
                console.log('Respuesta de motores:', responseMot);
                if (responseMot && responseMot.length > 0) {
                  this.compra = responseMot[0];
                } else if (responseMot && responseMot.id) {
                  this.compra = responseMot;
                } else {
                  this.compra = responseMot;
                }
                
                if (this.compra && this.compra.id) {
                  clearTimeout(timeout);
                  this.cargando = false;
                  console.log('Compra encontrada en motores:', this.compra);
                  this.cargarEquipos();
                  this.cargarAnexos();
                } else {
                  console.error('No se encontró la compra con ID:', id);
                  clearTimeout(timeout);
                  this.cargando = false;
                  this.volverACompras();
                }
              },
              error: (error) => {
                console.error('Error al cargar motores:', error);
                clearTimeout(timeout);
                this.cargando = false;
                this.volverACompras();
              }
            });
          },
          error: (error) => {
            console.error('Error al cargar mantenimiento:', error);
            clearTimeout(timeout);
            this.cargando = false;
            this.volverACompras();
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar equipamiento:', error);
        console.log('Intentando método alternativo...');
        this.cargarCompraPorIdAlternativo(id);
      }
    });
  }

  cargarEquipos(): void {
    if (!this.compra || !this.compra.id) {
      console.error('No hay ID de compra disponible para cargar equipos');
      return;
    }

    this.cargandoEquipos = true;

    this.comprasService.getEquiposPorIdEquipamiento(this.compra.id.toString())
    .subscribe({
      next: (data: any) => {
        this.equipos = data.equipos; 
        this.cargandoEquipos = false;
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
        this.equipos = [];
        this.cargandoEquipos = false;
      }
    });

  }

  cargarAnexos(): void {
    if (!this.compra || !this.compra.id) {
      console.error('No hay ID de compra disponible para cargar anexos');
      return;
    }

    this.cargandoAnexos = true;

    this.comprasService.getAnexos(this.compra.id.toString())
    .subscribe({
      next: (data: any) => {
        this.anexos = data.anexos || data || []; 
        this.cargandoAnexos = false;
        
        // Debug: Log the structure of the first anexo to understand available properties
        if (this.anexos.length > 0) {
          console.log('Estructura del primer anexo:', this.anexos[0]);
          console.log('Propiedades disponibles:', Object.keys(this.anexos[0]));
        }
      },
      error: (error) => {
        console.error('Error al cargar anexos:', error);
        this.anexos = [];
        this.cargandoAnexos = false;
      }
    });
  }
  
  

  volverACompras(): void {
    this.router.navigate(['/compras']);
  }

    inicializarFormulario(): void {
    this.formularioEdicion = this.fb.group({
      id: [''],
      memo: [''],
      numero: [''],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      detalle: [''],
      monto: ['', [Validators.required, Validators.min(0)]],
      rubro: ['', Validators.required],
      resolucion: [''],
      monto_resol_final: [''],
      trimestre: ['', Validators.required],
      estado: ['', Validators.required],
      obs: ['']
    });
  }

  inicializarFormularioAgregarEquipo(): void {
    this.formularioAgregarEquipo = this.fb.group({
      id_equipamiento: ['', Validators.required],
      nro_item: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      servicio: ['', Validators.required]
    });
  }

  inicializarFormularioEditarEquipo(): void {
    this.formularioEditarEquipo = this.fb.group({
      id: ['', Validators.required],
      id_equipamiento: ['', Validators.required],
      nro_item: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      servicio: ['', Validators.required]
    });
  }

  abrirFormularioEdicion(): void {
    if (this.compra) {
      console.log('Datos de la compra para edición:', this.compra);
      console.log('Trimestre de la compra:', this.compra.trimestre);
      
      this.formularioEdicion.patchValue({
        id: this.compra.id || '',
        memo: this.compra.memo || '',
        numero: this.compra.numero || '',
        nombre: this.compra.nombre || '',
        tipo: this.compra.tipo || '',
        detalle: this.compra.detalle || '',
        monto: this.compra.monto || '',
        rubro: this.compra.rubro || '',
        resolucion: this.compra.resolucion || '',
        monto_resol_final: this.compra.monto_resol_final || '',
        trimestre: this.compra.trimestre || '',
        estado: this.compra.estado || '',
        obs: this.compra.obs || ''
      });
      
      // Forzar la actualización del formulario
      this.formularioEdicion.updateValueAndValidity();
      console.log('Valor del trimestre en el formulario:', this.formularioEdicion.get('trimestre')?.value);
      
      this.mostrarFormularioEdicion = true;
    }
  }

  cerrarFormularioEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.guardando = false;
  }

  guardarEdicion(): void {
    if (this.formularioEdicion.valid) {
      this.guardando = true;
      

      const datosActualizados = this.formularioEdicion.value;
      const id = this.compra.id;
      

      
      // Determinar qué tipo de compra es y usar el método correspondiente
      // Por ahora asumimos que es equipamiento, pero esto se puede mejorar
      
      // Agregar timeout para evitar que se quede cargando indefinidamente
      const timeout = setTimeout(() => {
        if (this.guardando) {
          console.error('Timeout: La petición tardó más de 10 segundos');
          this.guardando = false;
          alert('La petición tardó demasiado. Verifique su conexión e intente nuevamente.');
        }
      }, 10000);
      
      this.comprasService.updateCompra(id, datosActualizados).subscribe({
        next: (response) => {
          clearTimeout(timeout); // Limpiar el timeout
          console.log('Respuesta del backend:', response);
          
          // Actualizar los datos locales con la respuesta del backend
          this.compra = { ...this.compra, ...datosActualizados };
          
          // Actualizar localStorage con los datos actualizados
          localStorage.setItem('compraSeleccionada', JSON.stringify(this.compra));
          
          this.guardando = false;
          this.mostrarFormularioEdicion = false;
          
          // Mostrar mensaje de éxito
          alert('Compra actualizada correctamente');
        },
        error: (error) => {
          clearTimeout(timeout); // Limpiar el timeout
          console.error('Error al actualizar la compra:', error);
          console.error('Detalles del error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url
          });
          this.guardando = false;
          
          // Mostrar mensaje de error más específico
          let mensajeError = 'Error al actualizar la compra.';
          if (error.status === 404) {
            mensajeError = 'No se encontró la compra en el servidor.';
          } else if (error.status === 500) {
            mensajeError = 'Error interno del servidor.';
          } else if (error.status === 0) {
            mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
          }
          
          alert(mensajeError + ' Por favor, intente nuevamente.');
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formularioEdicion.controls).forEach(key => {
        const control = this.formularioEdicion.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancelarEdicion(): void {
    this.cerrarFormularioEdicion();
  }

  exportarAExcel(): void {
    if (!this.compra) {
      alert('No hay datos para exportar');
      return;
    }

    try {
      // Preparar los datos para la exportación
      const datosParaExportar = [
        {
          'ID': this.compra.id || 'N/A',
          'Memo': this.compra.memo || 'N/A',
          'Número': this.compra.numero || 'N/A',
          'Nombre': this.compra.nombre || 'N/A',
          'Tipo': this.compra.tipo || 'N/A',
          'Detalle': this.compra.detalle || 'N/A',
          'Monto': this.compra.monto ? `$${this.compra.monto.toLocaleString('es-AR')}` : 'N/A',
          'Rubro': this.compra.rubro || 'N/A',
          'Resolución': this.compra.resolucion || 'N/A',
          'Monto Resolución Final': this.compra.monto_resol_final ? `$${this.compra.monto_resol_final.toLocaleString('es-AR')}` : 'N/A',
          'Trimestre': this.compra.trimestre || 'N/A',
          'Estado': this.compra.estado || 'N/A',
          'Observaciones': this.compra.obs || 'N/A'
        }
      ];

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosParaExportar);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 15 }, // Memo
        { wch: 12 }, // Número
        { wch: 25 }, // Nombre
        { wch: 8 },  // Tipo
        { wch: 30 }, // Detalle
        { wch: 15 }, // Monto
        { wch: 15 }, // Rubro
        { wch: 15 }, // Resolución
        { wch: 20 }, // Monto Resolución Final
        { wch: 15 }, // Trimestre
        { wch: 12 }, // Estado
        { wch: 30 }  // Observaciones
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalles de Compra');

      // Generar el nombre del archivo con fecha y hora
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const nombreArchivo = `Detalles_Compra_${this.compra.id || this.compra.numero}_${fecha}_${hora}.xlsx`;

      // Exportar el archivo
      XLSX.writeFile(workbook, nombreArchivo);

      // Mostrar mensaje de éxito
      alert('Archivo Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar el archivo Excel. Por favor, intente nuevamente.');
    }
  }

  // Métodos para el formulario de agregar equipo
  abrirFormularioAgregarEquipo(): void {
    this.mostrarFormularioAgregarEquipo = true;
    this.formularioAgregarEquipo.reset();
    
    // Cargar automáticamente el id_equipamiento con el valor de compra.id
    if (this.compra && this.compra.id) {
      this.formularioAgregarEquipo.patchValue({
        id_equipamiento: this.compra.id.toString()
      });
    }
  }

  cerrarFormularioAgregarEquipo(): void {
    this.mostrarFormularioAgregarEquipo = false;
    this.guardandoEquipo = false;
  }

  guardarEquipo(): void {
    if (this.formularioAgregarEquipo.valid && this.compra && this.compra.id) {
      this.guardandoEquipo = true;
      
      const datosEquipo = this.formularioAgregarEquipo.value;
      
      // Agregar timeout para evitar que se quede cargando indefinidamente
      const timeout = setTimeout(() => {
        if (this.guardandoEquipo) {
          console.error('Timeout: La petición tardó más de 10 segundos');
          this.guardandoEquipo = false;
          alert('La petición tardó demasiado. Verifique su conexión e intente nuevamente.');
        }
      }, 10000);
      
      this.comprasService.createEquipo_Equipamiento( datosEquipo).subscribe({
        next: (response) => {
          clearTimeout(timeout);
          
          this.guardandoEquipo = false;
          this.mostrarFormularioAgregarEquipo = false;
          
          // Recargar la lista de equipos
          this.cargarEquipos();
          
          // Mostrar mensaje de éxito
          alert('Equipo agregado correctamente');
        },
        error: (error) => {
          clearTimeout(timeout);
          console.error('Error al crear el equipo:', error);
          this.guardandoEquipo = false;
          
          // Mostrar mensaje de error más específico
          let mensajeError = 'Error al crear el equipo.';
          if (error.status === 404) {
            mensajeError = 'No se encontró el equipamiento en el servidor.';
          } else if (error.status === 500) {
            mensajeError = 'Error interno del servidor.';
          } else if (error.status === 0) {
            mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
          }
          
          alert(mensajeError + ' Por favor, intente nuevamente.');
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formularioAgregarEquipo.controls).forEach(key => {
        const control = this.formularioAgregarEquipo.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancelarAgregarEquipo(): void {
    this.cerrarFormularioAgregarEquipo();
  }

  // Método para editar equipo
  editarEquipo(equipo: any): void {
    console.log('Editando equipo:', equipo);
    this.equipoSeleccionado = equipo;
    this.mostrarFormularioEditarEquipo = true;

    
    // Cargar los datos del equipo en el formulario
    this.formularioEditarEquipo.patchValue({
      id: equipo.id || '',
      id_equipamiento: equipo.id_equipamiento || '',
      nro_item: equipo.nro_item || '',
      nombre: equipo.nombre || '',
      cantidad: equipo.cantidad || '',
      servicio: equipo.servicio || ''
    });
  }

  cerrarFormularioEditarEquipo(): void {
    this.mostrarFormularioEditarEquipo = false;
    this.guardandoEdicionEquipo = false;
    this.equipoSeleccionado = null;
  }

  guardarEdicionEquipo(): void {
    if (this.formularioEditarEquipo.valid && this.equipoSeleccionado) {
      this.guardandoEdicionEquipo = true;
      
      const datosEquipo = this.formularioEditarEquipo.value;
      const id = this.equipoSeleccionado.id;
      
      // Agregar timeout para evitar que se quede cargando indefinidamente
      const timeout = setTimeout(() => {
        if (this.guardandoEdicionEquipo) {
          console.error('Timeout: La petición tardó más de 10 segundos');
          this.guardandoEdicionEquipo = false;
          alert('La petición tardó demasiado. Verifique su conexión e intente nuevamente.');
        }
      }, 10000);
      
      this.comprasService.updateEquipo_Equipamiento(id, datosEquipo).subscribe({
        next: (response) => {
          clearTimeout(timeout);
          
          this.guardandoEdicionEquipo = false;
          this.mostrarFormularioEditarEquipo = false;
          this.equipoSeleccionado = null;
          
          // Recargar la lista de equipos
          this.cargarEquipos();
          
          // Mostrar mensaje de éxito
          alert('Equipo actualizado correctamente');
        },
        error: (error) => {
          clearTimeout(timeout);
          console.error('Error al actualizar el equipo:', error);
          this.guardandoEdicionEquipo = false;
          
          // Mostrar mensaje de error más específico
          let mensajeError = 'Error al actualizar el equipo.';
          if (error.status === 404) {
            mensajeError = 'No se encontró el equipo en el servidor.';
          } else if (error.status === 500) {
            mensajeError = 'Error interno del servidor.';
          } else if (error.status === 0) {
            mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
          }
          
          alert(mensajeError + ' Por favor, intente nuevamente.');
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formularioEditarEquipo.controls).forEach(key => {
        const control = this.formularioEditarEquipo.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancelarEdicionEquipo(): void {
    this.cerrarFormularioEditarEquipo();
  }

  // Método para eliminar equipo
  eliminarEquipo(equipo: any): void {
    if (confirm(`¿Está seguro de que desea eliminar el equipo "${equipo.nombre}"?`)) {
      this.comprasService.deleteEquipo_Equipamiento(equipo.id).subscribe({
        next: (response) => {
          alert('Equipo eliminado correctamente');
          this.cargarEquipos(); // Recargar la lista de equipos
        },
        error: (error) => {
          console.error('Error al eliminar el equipo:', error);
          alert('Error al eliminar el equipo. Por favor, intente nuevamente.');
        }
      });
    }
  }

  // Métodos para manejar anexos
  abrirSelectorArchivo(): void {
    const fileInput = document.getElementById('archivo-input') as HTMLInputElement;
    
    if (fileInput) {
      fileInput.click();
    }
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("Contenido:", e.target?.result);
        // Si es PDF o imagen podrías mostrarlo en un <iframe> o <img>
      };
      reader.readAsDataURL(file);
    }
  }

  seleccionarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  cancelarSeleccionArchivo(): void {
    this.archivoSeleccionado = null;
    const fileInput = document.getElementById('archivo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  subirAnexo(): void {
    if (!this.archivoSeleccionado || !this.compra || !this.compra.id) {
      alert('Por favor, seleccione un archivo para subir');
      return;
    }

    this.subiendoAnexo = true;

    // Agregar timeout para evitar que se quede cargando indefinidamente
    const timeout = setTimeout(() => {
      if (this.subiendoAnexo) {
        console.error('Timeout: La petición tardó más de 30 segundos');
        this.subiendoAnexo = false;
        alert('La petición tardó demasiado. Verifique su conexión e intente nuevamente.');
      }
    }, 30000); // 30 segundos para archivos

    this.comprasService.subirAnexo(this.compra.id.toString(), this.archivoSeleccionado).subscribe({
      next: (response) => {
        clearTimeout(timeout);
        
        this.subiendoAnexo = false;
        this.archivoSeleccionado = null;
        
        // Limpiar el input de archivo
        const fileInput = document.getElementById('archivo-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Recargar la lista de anexos
        this.cargarAnexos();
        
        // Mostrar mensaje de éxito
        alert('Anexo subido correctamente');
      },
      error: (error) => {
        clearTimeout(timeout);
        console.error('Error al subir anexo:', error);
        this.subiendoAnexo = false;
        
        // Mostrar mensaje de error más específico
        let mensajeError = 'Error al subir el anexo.';
        if (error.status === 404) {
          mensajeError = 'No se encontró la compra en el servidor.';
        } else if (error.status === 413) {
          mensajeError = 'El archivo es demasiado grande.';
        } else if (error.status === 500) {
          mensajeError = 'Error interno del servidor.';
        } else if (error.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
        }
        
        alert(mensajeError + ' Por favor, intente nuevamente.');
      }
    });
  }

  descargarAnexo(anexo: any): void {
    if (!anexo || (!anexo.id && !anexo.filename)) {
      alert('No se puede descargar el anexo: información insuficiente');
      return;
    }

    console.log('Descargando anexo:', anexo);
    
    this.comprasService.descargarAnexo(anexo.id || anexo.filename).subscribe({
      next: (blob: Blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = anexo.nombre || anexo.filename || 'documento';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('Archivo descargado correctamente');
      },
      error: (error) => {
        console.error('Error al descargar el anexo:', error);
        alert('Error al descargar el archivo. Por favor, intente nuevamente.');
      }
    });
  }

  eliminarAnexo(anexo: any): void {
    if (confirm(`¿Está seguro de que desea eliminar el anexo "${anexo.nombre_original || anexo.filename}"?`)) {
      this.comprasService.deleteAnexo(anexo.id).subscribe({
        next: (response) => {
          alert('Anexo eliminado correctamente');
          this.cargarAnexos();
        },
        error: (error) => {
          console.error('Error al eliminar el anexo:', error);
          alert('Error al eliminar el anexo. Por favor, intente nuevamente.');
        }
      });
    } else {
      alert('No se puede eliminar el anexo. Por favor, intente nuevamente.');
    }
   }

  obtenerTipoArchivo(nombreArchivo: string): string {
    // Verificar que el nombre del archivo existe y es una cadena válida
    if (!nombreArchivo || typeof nombreArchivo !== 'string') {
      return 'desconocido';
    }
    
    const extension = nombreArchivo.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return 'imagen';
      case 'txt':
        return 'texto';
      case 'doc':
      case 'docx':
        return 'documento';
      case 'xls':
      case 'xlsx':
        return 'hoja-calculo';
      default:
        return 'desconocido';
    }
  }

  obtenerUrlPreview(anexo: any): string {
    // Verificar que el anexo existe
    if (!anexo) {
      console.error('Anexo es undefined o null');
      return '';
    }
    
    console.log('Generando URL para anexo:', anexo);
    
    // Opción 1: Si el anexo tiene una ruta/path almacenada, usarla directamente
    if (anexo.ruta || anexo.path || anexo.file_path || anexo.ubicacion) {
      const filePath = anexo.ruta || anexo.path || anexo.file_path || anexo.ubicacion;
      console.log('Usando ruta almacenada:', filePath);
      
      // Usar el servicio para construir la URL desde la ruta
      const fullUrl = this.comprasService.getUrlPreviewByPath(filePath);
      console.log('URL construida desde ruta usando servicio:', fullUrl);
      return fullUrl;
    }
    
    // Opción 2: Usar el método del servicio con ID/filename (método actual)
    const url = this.comprasService.getUrlPreviewAnexo(anexo.id || anexo.filename || 'default');
    console.log('URL de preview generada por servicio:', url);
    return url;
  }

  verificarUrlPreview(url: string): boolean {
    // Verificar que la URL no esté vacía y tenga un formato válido
    if (!url || url.length === 0) {
      console.log('URL vacía o inválida');
      return false;
    }
    
    // Verificar si es una URL del servicio de anexos
    if (url.includes('/anexo/preview/')) {
      console.log('URL válida del servicio de anexos');
      return true;
    }
    
    // Verificar si es una URL de archivo
    if (url.includes('/files/') || url.startsWith('http')) {
      console.log('URL válida de archivo');
      return true;
    }
    
    console.log('URL no reconocida como válida:', url);
    return false;
  }

  onImageError(event: any): void {
    // Manejar error de carga de imagen
    console.error('Error al cargar la imagen:', event);
    event.target.style.display = 'none';
    // Mostrar un mensaje de error o una imagen por defecto
  }

  onIframeError(event: any): void {
    // Manejar error de carga en iframe (PDF)
    console.error('Error al cargar el PDF:', event);
    alert('Error al cargar el documento PDF. El archivo puede estar corrupto o no estar disponible.');
  }

  // Método para probar si una URL es accesible
  probarUrlAccesible(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log('URL accesible:', url);
        resolve(true);
      };
      img.onerror = () => {
        console.log('URL no accesible:', url);
        resolve(false);
      };
      img.src = url;
    });
  }

  // Método para debuggear la estructura de un anexo
  

  // Método para obtener la ruta del archivo desde el anexo
  obtenerRutaArchivo(anexo: any): string | null {
    if (!anexo) {
      return null;
    }
    
    // Buscar propiedades que contengan la ruta del archivo
    const rutaArchivo = anexo.ruta || anexo.path || anexo.file_path || anexo.ubicacion || anexo.ruta_archivo;
    
    if (rutaArchivo) {
      console.log('Ruta de archivo encontrada:', rutaArchivo);
      return rutaArchivo;
    }
    
    console.log('No se encontró ruta de archivo en el anexo');
    return null;
  }



  // Método para obtener la ruta de la carpeta desde la ruta del archivo
  private obtenerRutaCarpeta(rutaArchivo: string): string | null {
    if (!rutaArchivo) {
      return null;
    }
    
    try {
      // Normalizar la ruta
      let rutaNormalizada = rutaArchivo;
      
      // Si es una ruta relativa, convertirla a absoluta
      if (!rutaArchivo.startsWith('/') && !rutaArchivo.match(/^[A-Za-z]:/)) {
        rutaNormalizada = `/${rutaArchivo}`;
      }
      
      // Extraer la carpeta contenedora
      const ultimaBarra = rutaNormalizada.lastIndexOf('/');
      const ultimaBarraInvertida = rutaNormalizada.lastIndexOf('\\');
      const ultimoSeparador = Math.max(ultimaBarra, ultimaBarraInvertida);
      
      if (ultimoSeparador > 0) {
        const rutaCarpeta = rutaNormalizada.substring(0, ultimoSeparador);
        console.log('Ruta de carpeta extraída:', rutaCarpeta);
        return rutaCarpeta;
      } else {
        console.log('No se encontró separador de directorio en la ruta');
        return rutaNormalizada; // Retornar la ruta completa si no hay separador
      }
    } catch (error) {
      console.error('Error al extraer ruta de carpeta:', error);
      return null;
    }
  }

  // Método para intentar abrir la carpeta
 
  // Método para abrir el archivo en el explorador del sistema
  abrirArchivoEnExplorador(rutaArchivo: string): void {
    console.log('Intentando abrir archivo:', rutaArchivo);
    
    // Intentar múltiples métodos para abrir el explorador
    this.intentarAbrirExplorador(rutaArchivo);
  }

  // Método para intentar abrir el explorador con diferentes estrategias
  private intentarAbrirExplorador(rutaArchivo: string): void {
    // Método 1: Intentar con el backend usando comandos del sistema
  
  }



  // Método para copiar texto al portapapeles
  copiarAlPortapapeles(texto: string): void {
    try {
      navigator.clipboard.writeText(texto).then(() => {
        alert('Ruta copiada al portapapeles');
      }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Ruta copiada al portapapeles');
      });
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      alert('No se pudo copiar la ruta al portapapeles');
    }
  }

  // Método para mostrar la ruta manualmente
  private mostrarRutaManual(rutaArchivo: string): void {
    const mensaje = `No se pudo abrir automáticamente el explorador de archivos.\n\nRuta del archivo:\n${rutaArchivo}\n\nPuede copiar esta ruta y abrirla manualmente en el explorador de archivos.`;
    
    if (confirm(mensaje + '\n\n¿Desea copiar la ruta al portapapeles?')) {
      this.copiarAlPortapapeles(rutaArchivo);
    }
  }
  
}
