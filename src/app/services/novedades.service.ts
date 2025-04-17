import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../envairoment';
@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

   private apiUrl =environment.apiUrl+'/novedades'; // Cambia esto si es necesario


    constructor(private http: HttpClient) { }
  
      getNovedadesHoy(): Observable<any> {
        const url = `${this.apiUrl}/hoy`;

        return this.http.get(url);
    }

    getNovedadesTodas(): Observable<any> {
      const url = `${this.apiUrl}/todas`;
      return this.http.get<any>(url);
    }
    
    createNovedad(novedad: any): Observable<any> {
      return this.http.post(this.apiUrl, novedad);
    }
    
    private formVisibilitySource = new BehaviorSubject<boolean>(false);
    formVisibility$ = this.formVisibilitySource.asObservable();
  
    toggleFormVisibility() {
      this.formVisibilitySource.next(!this.formVisibilitySource.value);
    }
  
    showForm() {
      this.formVisibilitySource.next(true);
    }
  
    hideForm() {
      this.formVisibilitySource.next(false);
    }
    // Puedes agregar más métodos para crear, actualizar y eliminar equipos
  }