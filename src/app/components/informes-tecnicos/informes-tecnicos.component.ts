import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { InformesTecnicosService } from '../../services/informes-tecnicos.service';
import { InformeTecnico } from '../../models/InformeTecnico';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informes-tecnicos',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    NavBarComponent,
    FormsModule
  ],
  templateUrl: './informes-tecnicos.component.html',
  styleUrls: ['./informes-tecnicos.component.css']
})
export class InformesTecnicosComponent implements OnInit {
  mostrarForm = false;
  esEdicion = false;
  informesTecnicos: InformeTecnico[] = [];
  nuevoInforme: InformeTecnico = {
    idinformes_tecnicos: 0,
    informes_tecnicos_fecha_recibido: '',
    informes_tecnicos_tipo_compra: '',
    informes_tecnicos_nro: '',
    informes_tecnicos_todo: '',
    informes_tecnicos_detalles: '',
    informes_tecnicos_estado: '',
    informes_tecnicos_tecnico: ''
  };

  opcionesEstado = ['sin asignar', 'en proceso', 'completado'];
  opcionesTodo = ['nuevo', 'rever'];
  opcionesTipoCompra = ['LAA', 'LA', 'CDA', 'CD', 'DE'];

  constructor(private informesTecnicosService: InformesTecnicosService) {}

  ngOnInit(): void {
    this.cargarInformesTecnicos();
  }

  cargarInformesTecnicos(): void {
    this.informesTecnicosService.obtenerInformesTecnicos().subscribe(
      (data: InformeTecnico[]) => {
        this.informesTecnicos = data;
      },
      (error) => {
        console.error('Error al cargar los informes técnicos', error);
        Notify.failure('Error al cargar los informes técnicos');
      }
    );
  }

  mostrarFormulario(): void {
    this.esEdicion = false;
    this.mostrarForm = true;
  }

  mostrarFormularioEdicion(informe: InformeTecnico): void {
    this.esEdicion = true;
    this.nuevoInforme = { ...informe };
    this.mostrarForm = true;
  }

  ocultarFormulario(): void {
    this.mostrarForm = false;
    this.esEdicion = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoInforme = {
      idinformes_tecnicos: 0,
      informes_tecnicos_fecha_recibido: '',
      informes_tecnicos_tipo_compra: '',
      informes_tecnicos_nro: '',
      informes_tecnicos_todo: '',
      informes_tecnicos_detalles: '',
      informes_tecnicos_estado: '',
      informes_tecnicos_tecnico: ''
    };
  }

  guardarInforme(): void {
    if (!this.validarFormulario()) {
      return;
    }

    Loading.standard(this.esEdicion ? 'Actualizando...' : 'Guardando...');

    if (this.esEdicion) {
      this.informesTecnicosService.actualizarInformeTecnico(this.nuevoInforme.idinformes_tecnicos, this.nuevoInforme).subscribe(
        (data: InformeTecnico) => {
          Loading.remove();
          Notify.success('Informe técnico actualizado exitosamente');
          this.ocultarFormulario();
          this.cargarInformesTecnicos();
        },
        (error) => {
          Loading.remove();
          Notify.failure('Error al actualizar el informe técnico');
          console.error('Error:', error);
        }
      );
    } else {
      this.informesTecnicosService.crearInformeTecnico(this.nuevoInforme).subscribe(
        (data: InformeTecnico) => {
          Loading.remove();
          Notify.success('Informe técnico creado exitosamente');
          this.ocultarFormulario();
          this.cargarInformesTecnicos();
        },
        (error) => {
          Loading.remove();
          Notify.failure('Error al crear el informe técnico');
          console.error('Error:', error);
        }
      );
    }
  }

  validarFormulario(): boolean {
    if (!this.nuevoInforme.informes_tecnicos_fecha_recibido) {
      Notify.warning('La fecha de recibido es obligatoria');
      return false;
    }
    if (!this.nuevoInforme.informes_tecnicos_tipo_compra) {
      Notify.warning('El tipo de compra es obligatorio');
      return false;
    }
    if (!this.nuevoInforme.informes_tecnicos_nro) {
      Notify.warning('El número es obligatorio');
      return false;
    }
    if (!this.nuevoInforme.informes_tecnicos_estado) {
      Notify.warning('El estado es obligatorio');
      return false;
    }
    return true;
  }

  eliminarInforme(informe: InformeTecnico): void {
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
      if (result.isConfirmed) {
        this.informesTecnicosService.eliminarInformeTecnico(informe.idinformes_tecnicos).subscribe(
          () => {
            Swal.fire('¡Eliminado!', 'El informe técnico ha sido eliminado.', 'success');
            this.cargarInformesTecnicos();
          },
          (error) => {
            console.error('Error al eliminar el informe técnico:', error);
            Swal.fire('Error', 'No se pudo eliminar el informe técnico.', 'error');
          }
        );
      }
    });
  }

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
}
