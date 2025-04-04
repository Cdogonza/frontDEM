import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facturacion } from '../models/Facturacion'; // Asegúrate de crear este modelo
import { Entrada } from '../models/Entrada'; // Asegúrate de crear este modelo
@Injectable({
  providedIn: 'root'
})
export class FacturacionService {
  private apiUrl = 'https://back-prueba-dem.onrender.com/facturacion'; // Cambia esta URL por la de tu backend

  constructor(private http: HttpClient) {}

  obtenerFacturaciones(): Observable<Facturacion[]> {
    return this.http.post<Facturacion[]>(this.apiUrl+'/getAll', {});
  }
  obtenerEntradas(): Observable<Entrada[]> {
    return this.http.post<Entrada[]>(this.apiUrl+'/getAllEntradas', {});
  }

  crearFacturacion(facturacion: Facturacion): Observable<Facturacion> {
    return this.http.post<Facturacion>(this.apiUrl+'/insert', facturacion);
  }
  crearEntrada(entrada: Entrada): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiUrl+'/insertEntrada', entrada);
  }

  actualizarFacturacion(facturacion: Facturacion): Observable<Facturacion> {
    return this.http.post<Facturacion>(`${this.apiUrl}/update`, facturacion);
  }

  eliminarFacturacion(idfacturacion: number): Observable<Facturacion> {
    return this.http.delete<Facturacion>(`${this.apiUrl}/delete/${idfacturacion}`);
  }
    
  updateEstado(idfacturacion: number): Observable<Facturacion> {
    return this.http.post<Facturacion>(`${this.apiUrl}/updateEstado`, {idfacturacion});
  }
  getTotalPendiente(): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/totalPendiente`, {});
  }
  getTotalPagado(): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/totalPagado`, {});
  }
  getTotalEntrada(): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/totalEntrada`, {});
  }
  getTotalCaja(): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/totalCaja`, {});
  }
  cerrarMes(mes: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cerrar-mes`, { mes });
  }
  cerrarCaja(mes: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cerrarCaja`, {mes});
  }
}