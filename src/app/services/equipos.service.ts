import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private apiUrl = 'https://back-prueba-dem.onrender.com/equipos'; // Cambia esto si es necesario
  //private apiUrl = 'http://localhost:3000/equipos';
  constructor(private http: HttpClient) { }

    getEquipos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

      private formVisibilitySourcee = new BehaviorSubject<boolean>(false);
      formVisibilityy$ = this.formVisibilitySourcee.asObservable();
  // Puedes agregar más métodos para crear, actualizar y eliminar equipos
  
  toggleFormVisibility() {
    this.formVisibilitySourcee.next(!this.formVisibilitySourcee.value);
  }

  showForm() {
    this.formVisibilitySourcee.next(true);
  }

  hideForm() {
    this.formVisibilitySourcee.next(false);
  }
}