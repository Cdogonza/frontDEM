import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mantenimiento } from '../models/Mantenimiento';
import { environment } from '../envairoment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  private apiUrl = `${environment.apiUrl}/mantenimientos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los mantenimientos
  getAllMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  // Crear un nuevo mantenimiento
  createMantenimiento(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(this.apiUrl, mantenimiento);
  }

  // Obtener un mantenimiento por ID
  getMantenimientoById(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un mantenimiento
  updateMantenimiento(id: number, mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(`${this.apiUrl}/${id}`, mantenimiento);
  }

  // Eliminar un mantenimiento
  deleteMantenimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener mantenimientos por empresa
  getMantenimientosByEmpresa(empresa: string): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}/empresa/${empresa}`);
  }

  // Obtener mantenimientos por rango de fechas
  getMantenimientosByDateRange(fechaInicio: string, fechaFin: string): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}/fechas/rango?inicio=${fechaInicio}&fin=${fechaFin}`);
  }

  // Toggle prórroga de un mantenimiento
  toggleProrroga(id: number): Observable<Mantenimiento> {
    return this.http.patch<Mantenimiento>(`${this.apiUrl}/${id}/toggle-prorroga`, {});
  }
}
