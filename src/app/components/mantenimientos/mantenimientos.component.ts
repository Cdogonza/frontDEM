import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { Mantenimiento } from '../../models/Mantenimiento';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ReactiveFormsModule],
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal de prórroga
  showProrrogaModal = false;
  prorrogaForm: FormGroup;
  mantenimientoSeleccionado: Mantenimiento | null = null;
  loadingProrroga = false;

  constructor(
    private mantenimientosService: MantenimientosService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.prorrogaForm = this.createProrrogaForm();
  }

  ngOnInit(): void {
    this.loadMantenimientos();
  }

  loadMantenimientos(): void {
    this.loading = true;
    this.error = null;
    
    this.mantenimientosService.getAllMantenimientos().subscribe({
      next: (data) => {
        this.mantenimientos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar mantenimientos:', error);
        this.error = 'Error al cargar los mantenimientos';
        this.loading = false;
      }
    });
  }

  verDetalles(id: number): void {
    this.router.navigate(['/mantenimientos/detalles', id]);
  }

  editarMantenimiento(id: number): void {
    this.router.navigate(['/mantenimientos/editar', id]);
  }

  crearNuevo(): void {
    this.router.navigate(['/mantenimientos/nuevo']);
  }

  eliminarMantenimiento(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este mantenimiento?')) {
      this.mantenimientosService.deleteMantenimiento(id).subscribe({
        next: () => {
          this.loadMantenimientos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar mantenimiento:', error);
          alert('Error al eliminar el mantenimiento');
        }
      });
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  accionAdicional(id: number): void {
    const mantenimiento = this.mantenimientos.find(m => m.id_mantenimiento === id);
    if (mantenimiento && !mantenimiento.PRORROGA && !mantenimiento.ES_PRORROGA) {
      this.mantenimientoSeleccionado = mantenimiento;
      this.precargarDatosProrroga(mantenimiento);
      this.showProrrogaModal = true;
    }
  }

  getProrrogaTooltip(mantenimiento: Mantenimiento): string {
    if (mantenimiento.ES_PRORROGA) {
      return 'Este es un procedimiento de prórroga';
    } else if (mantenimiento.PRORROGA) {
      return 'Ya tiene prórroga';
    } else {
      return 'Crear prórroga';
    }
  }

  createProrrogaForm(): FormGroup {
    return this.fb.group({
      MEMO: [''],
      TIPO_NRO_PROC: [''],
      OBJETO: [''],
      APIA: [''],
      RESOLUCION: [''],
      MONTO_INICIADO: [null],
      EMPRESA: [''],
      MONTO_FINAL: [null],
      INICIO: [''],
      FIN: [''],
      DURACION: [''],
      PERIODICIDAD: [''],
      OBS: [''],
      DATOS_RELEVANTES: [''],
      PRORROGA: [false],
      ES_PRORROGA: [false]
    });
  }

  precargarDatosProrroga(mantenimiento: Mantenimiento): void {
    this.prorrogaForm.patchValue({
      OBJETO: mantenimiento.OBJETO || '',
      TIPO_NRO_PROC: mantenimiento.TIPO_NRO_PROC || '',
      EMPRESA: mantenimiento.EMPRESA || '',
      OBS: mantenimiento.OBS || '',
      // Limpiar otros campos para que se llenen nuevos
      MEMO: '',
      APIA: '',
      RESOLUCION: '',
      MONTO_INICIADO: null,
      MONTO_FINAL: null,
      INICIO: '',
      FIN: '',
      DURACION: '',
      PERIODICIDAD: '',
      DATOS_RELEVANTES: '',
      PRORROGA: false,
      ES_PRORROGA: false
    });
  }

  guardarProrroga(): void {
    if (this.prorrogaForm.valid && this.mantenimientoSeleccionado) {
      this.loadingProrroga = true;
      
      const formData = this.prorrogaForm.value;
      const nuevoMantenimiento: Mantenimiento = {
        ...formData,
        MONTO_INICIADO: formData.MONTO_INICIADO ?? undefined,
        MONTO_FINAL: formData.MONTO_FINAL ?? undefined,
        ES_PRORROGA: true // Marcar como prórroga
      };

      console.log('Datos del nuevo mantenimiento (prórroga):', nuevoMantenimiento);
      
      // Crear el nuevo mantenimiento
      this.mantenimientosService.createMantenimiento(nuevoMantenimiento).subscribe({
        next: (response) => {
          console.log('Respuesta del backend al crear prórroga:', response);
          // Actualizar el mantenimiento original para marcar como prorrogado usando el endpoint específico
          this.mantenimientosService.toggleProrroga(
            this.mantenimientoSeleccionado!.id_mantenimiento!
          ).subscribe({
            next: () => {
              this.loadingProrroga = false;
              this.cerrarModalProrroga();
              this.loadMantenimientos(); // Recargar la lista
            },
            error: (error) => {
              console.error('Error al actualizar estado de prórroga:', error);
              this.loadingProrroga = false;
              alert('Error al actualizar el estado de prórroga');
            }
          });
        },
        error: (error) => {
          console.error('Error al crear prórroga:', error);
          this.loadingProrroga = false;
          alert('Error al crear la prórroga');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cerrarModalProrroga(): void {
    this.showProrrogaModal = false;
    this.mantenimientoSeleccionado = null;
    this.prorrogaForm.reset();
  }

  markFormGroupTouched(): void {
    Object.keys(this.prorrogaForm.controls).forEach(key => {
      const control = this.prorrogaForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.prorrogaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
