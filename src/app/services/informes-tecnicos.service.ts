import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeTecnico } from '../models/InformeTecnico';
import { environment } from '../envairoment';

@Injectable({
  providedIn: 'root'
})
export class InformesTecnicosService {
  private apiUrl = environment.apiUrl + '/informes_tecnicos';

  constructor(private http: HttpClient) {}

  obtenerInformesTecnicos(): Observable<InformeTecnico[]> {
    return this.http.get<InformeTecnico[]>(this.apiUrl);
  }

  obtenerInformeTecnicoPorId(id: number): Observable<InformeTecnico> {
    return this.http.get<InformeTecnico>(`${this.apiUrl}/${id}`);
  }

  crearInformeTecnico(informeTecnico: InformeTecnico): Observable<InformeTecnico> {
    return this.http.post<InformeTecnico>(this.apiUrl, informeTecnico);
  }

  actualizarInformeTecnico(id: number, informeTecnico: InformeTecnico): Observable<InformeTecnico> {
    return this.http.put<InformeTecnico>(`${this.apiUrl}/${id}`, informeTecnico);
  }

  eliminarInformeTecnico(id: number): Observable<InformeTecnico> {
    return this.http.delete<InformeTecnico>(`${this.apiUrl}/${id}`);
  }
}
