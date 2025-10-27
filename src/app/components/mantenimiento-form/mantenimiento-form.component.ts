import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { Mantenimiento, MantenimientoFormData } from '../../models/Mantenimiento';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-mantenimiento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './mantenimiento-form.component.html',
  styleUrls: ['./mantenimiento-form.component.css']
})
export class MantenimientoFormComponent implements OnInit {
  mantenimientoForm: FormGroup;
  isEditMode = false;
  mantenimientoId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mantenimientosService: MantenimientosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mantenimientoForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.mantenimientoId = +params['id'];
        this.loadMantenimiento();
      }
    });
  }

  createForm(): FormGroup {
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
      BIBLORATO: [null]
    });
  }

  loadMantenimiento(): void {
    if (!this.mantenimientoId) return;

    this.loading = true;
    this.mantenimientosService.getMantenimientoById(this.mantenimientoId).subscribe({
      next: (mantenimiento) => {
        this.populateForm(mantenimiento);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar mantenimiento:', error);
        this.error = 'Error al cargar el mantenimiento';
        this.loading = false;
      }
    });
  }

  populateForm(mantenimiento: Mantenimiento): void {
    this.mantenimientoForm.patchValue({
      MEMO: mantenimiento.MEMO || '',
      TIPO_NRO_PROC: mantenimiento.TIPO_NRO_PROC || '',
      OBJETO: mantenimiento.OBJETO || '',
      APIA: mantenimiento.APIA || '',
      RESOLUCION: mantenimiento.RESOLUCION || '',
      MONTO_INICIADO: mantenimiento.MONTO_INICIADO || null,
      EMPRESA: mantenimiento.EMPRESA || '',
      MONTO_FINAL: mantenimiento.MONTO_FINAL || null,
      INICIO: mantenimiento.INICIO ? this.formatDateForInput(mantenimiento.INICIO) : '',
      FIN: mantenimiento.FIN ? this.formatDateForInput(mantenimiento.FIN) : '',
      DURACION: mantenimiento.DURACION || '',
      PERIODICIDAD: mantenimiento.PERIODICIDAD || '',
      OBS: mantenimiento.OBS || '',
      DATOS_RELEVANTES: mantenimiento.DATOS_RELEVANTES || '',
      PRORROGA: mantenimiento.PRORROGA || false,
      BIBLORATO: mantenimiento.BIBLORATO || null
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.mantenimientoForm.valid) {
      this.loading = true;
      this.error = null;

      const formData: MantenimientoFormData = this.mantenimientoForm.value;

      if (this.isEditMode && this.mantenimientoId) {
        this.updateMantenimiento(formData);
      } else {
        this.createMantenimiento(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createMantenimiento(formData: MantenimientoFormData): void {
    const mantenimiento: Mantenimiento = {
      ...formData,
      MONTO_INICIADO: formData.MONTO_INICIADO ?? undefined,
      MONTO_FINAL: formData.MONTO_FINAL ?? undefined,
      BIBLORATO: formData.BIBLORATO ?? undefined
    };
    this.mantenimientosService.createMantenimiento(mantenimiento).subscribe({
      next: () => {
        this.router.navigate(['/mantenimientos']);
      },
      error: (error) => {
        console.error('Error al crear mantenimiento:', error);
        this.error = 'Error al crear el mantenimiento';
        this.loading = false;
      }
    });
  }

  updateMantenimiento(formData: MantenimientoFormData): void {
    if (!this.mantenimientoId) return;

    const mantenimiento: Mantenimiento = {
      ...formData,
      MONTO_INICIADO: formData.MONTO_INICIADO ?? undefined,
      MONTO_FINAL: formData.MONTO_FINAL ?? undefined,
      BIBLORATO: formData.BIBLORATO ?? undefined
    };
    this.mantenimientosService.updateMantenimiento(this.mantenimientoId, mantenimiento).subscribe({
      next: () => {
        this.router.navigate(['/mantenimientos']);
      },
      error: (error) => {
        console.error('Error al actualizar mantenimiento:', error);
        this.error = 'Error al actualizar el mantenimiento';
        this.loading = false;
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.mantenimientoForm.controls).forEach(key => {
      const control = this.mantenimientoForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/mantenimientos']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.mantenimientoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
