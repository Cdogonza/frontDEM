import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../envairoment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private apiUrl =environment.apiUrl+'/documentos'; // Cambia esto si es necesario


  constructor(private http: HttpClient) { }


  getDocumentos(): Observable<any> {
    const url = `${this.apiUrl}/todos`;
    return this.http.get<any>(url);
  }
  
  createDocumentos(documentos: any): Observable<any> {
    return this.http.post(this.apiUrl, documentos);
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