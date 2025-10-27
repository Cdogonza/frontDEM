import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { Mantenimiento } from '../../models/Mantenimiento';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-mantenimiento-detalles',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './mantenimiento-detalles.component.html',
  styleUrls: ['./mantenimiento-detalles.component.css']
})
export class MantenimientoDetallesComponent implements OnInit {
  mantenimiento: Mantenimiento | null = null;
  loading = false;
  error: string | null = null;
  mantenimientoId: number | null = null;

  constructor(
    private mantenimientosService: MantenimientosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mantenimientoId = +params['id'];
        this.loadMantenimiento();
      }
    });
  }

  loadMantenimiento(): void {
    if (!this.mantenimientoId) return;

    this.loading = true;
    this.error = null;

    this.mantenimientosService.getMantenimientoById(this.mantenimientoId).subscribe({
      next: (mantenimiento) => {
        this.mantenimiento = mantenimiento;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar mantenimiento:', error);
        this.error = 'Error al cargar los detalles del mantenimiento';
        this.loading = false;
      }
    });
  }

  editarMantenimiento(): void {
    if (this.mantenimientoId) {
      this.router.navigate(['/mantenimientos/editar', this.mantenimientoId]);
    }
  }

  volver(): void {
    this.router.navigate(['/mantenimientos']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatBoolean(value: boolean | undefined): string {
    if (value === undefined || value === null) return 'No especificado';
    return value ? 'Sí' : 'No';
  }

  hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}
