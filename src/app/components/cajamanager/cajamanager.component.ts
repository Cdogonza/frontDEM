import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturacionService } from '../../services/facturacion.service';
import { Entrada } from '../../models/Entrada';
import { User } from '../../services/auth.service';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
@Component({
  selector: 'app-cajamanager',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule,
    CommonModule,NavBarComponent
  ],
  providers: [FacturacionService, AuthService],
  templateUrl: './cajamanager.component.html',
  styleUrl: './cajamanager.component.css'
})
export class CajamanagerComponent implements OnInit {
  entradas: Entrada[] = [];
  entradasFiltradas: Entrada[] = [];
  entradaForm: FormGroup;
  showModal = false;
  showConfirmModal = false;
  modoEdicion = false;
  entradaSeleccionada: Entrada | null = null;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' = 'success';
  loggedUser : User | null = null; // Usuario logueado
  // Filtros
  filtroConcepto: string = '';
  filtroUsuario: string = '';
  filtroFecha: string = '';

  constructor(private fb: FormBuilder, private authservice:AuthService, private facturacionService: FacturacionService) {
    this.entradaForm = this.fb.group({
      id: [null],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [this.obtenerFechaActual(), Validators.required],
      username: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarEntradas();
    this.loggedUser  = this.authservice.getLoggedUser (); // Obtener el usuario logueado
  }

  cargarEntradas(): void {
    this.facturacionService.obtenerEntradas().subscribe(
      (data) => {
        this.entradas = data;
        this.entradasFiltradas = [...this.entradas];
      },
      (error) => {
        console.error('Error al cargar entradas:', error);
        this.mostrarMensaje('Error al cargar las entradas', 'error');
      }
    );
  }

  openEntradaModal(): void {
    this.modoEdicion = false;
    this.entradaForm.reset({
      fecha: this.obtenerFechaActual()
    });
    this.showModal = true;
  }

  editarEntrada(entrada: Entrada): void {
    this.modoEdicion = true;
    this.entradaSeleccionada = entrada;
    
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const fecha = new Date(entrada.fecha);
    const fechaFormateada = fecha.toISOString().split('T')[0];
    
    this.entradaForm.patchValue({
      id: entrada.identrada,
      monto: entrada.monto,
      fecha: fechaFormateada,
      username: entrada.username,
      motivo: entrada.motivo
    });
    
    this.showModal = true;
  }

  confirmarEliminar(entrada: Entrada): void {
    this.entradaSeleccionada = entrada;
    this.showConfirmModal = true;
  }

  cancelarEliminar(): void {
    this.entradaSeleccionada = null;
    this.showConfirmModal = false;
  }

  eliminarEntrada(): void {
    if (this.entradaSeleccionada) {
      this.facturacionService.deleteEntrada(this.entradaSeleccionada.identrada).subscribe(
        () => {
          this.cargarEntradas();
          this.mostrarMensaje('Entrada eliminada correctamente', 'success');
          this.showConfirmModal = false;
          this.entradaSeleccionada = null;
        },
        (error) => {
          console.error('Error al eliminar entrada:', error);
          this.mostrarMensaje('Error al eliminar la entrada', 'error');
        }
      );
    }
  }

  guardarEntrada(): void {
    if (this.entradaForm.invalid) {
      return;
    }

    const entradaData = this.entradaForm.value;
    
    if (this.modoEdicion) {
      this.facturacionService.updateEntrada(entradaData.id, entradaData).subscribe(
        () => {
          this.cargarEntradas();
          this.mostrarMensaje('Entrada actualizada correctamente', 'success');
          this.closeModal();
        },
        (error) => {
          console.error('Error al actualizar entrada:', error);
          this.mostrarMensaje('Error al actualizar la entrada', 'error');
        }
      );
    } else {
      this.facturacionService.crearEntrada(entradaData).subscribe(
        () => {
          this.cargarEntradas();
          this.mostrarMensaje('Entrada creada correctamente', 'success');
          this.closeModal();
        },
        (error) => {
          console.error('Error al crear entrada:', error);
          this.mostrarMensaje('Error al crear la entrada', 'error');
        }
      );
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.entradaForm.reset({
      fecha: this.obtenerFechaActual()
    });
  }

  aplicarFiltros(): void {
    this.entradasFiltradas = this.entradas.filter(entrada => {
      const conceptoMatch = this.filtroConcepto ? 
        entrada.motivo.toLowerCase().includes(this.filtroConcepto.toLowerCase()) : true;
      
      const usuarioMatch = this.filtroUsuario ? 
        entrada.username.toLowerCase().includes(this.filtroUsuario.toLowerCase()) : true;
      
      let fechaMatch = true;
      if (this.filtroFecha) {
        const fechaEntrada = new Date(entrada.fecha).toISOString().split('T')[0];
        fechaMatch = fechaEntrada === this.filtroFecha;
      }
      
      return conceptoMatch && usuarioMatch && fechaMatch;
    });
  }

  obtenerFechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}
