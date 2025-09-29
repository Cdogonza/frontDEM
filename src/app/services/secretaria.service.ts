import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import type { Observable } from "rxjs"
import type { Equipos } from "../models/equipos"
import { environment } from "../envairoment"
import type { Secretaria } from "../models/Secretaria"

@Injectable({
  providedIn: "root",
})
export class SecretariaService {
  private apiUrl = `${environment.apiUrl}/secretaria`;

  constructor(private http: HttpClient) { }

  getSecretariaItems(): Observable<Secretaria[]> {
    return this.http.get<Secretaria[]>(this.apiUrl)
  }

  getSecretariaItem(id: number): Observable<Equipos> {
    return this.http.post<Equipos>(`${this.apiUrl}/taller`,{id}  )
  }

  createSecretariaItem(item: Omit<Secretaria, "id">): Observable<Secretaria> {
    return this.http.post<Secretaria>(this.apiUrl, item)
  }

  updateSecretariaItem(id: number, item: Partial<Secretaria>): Observable<Secretaria> {
    return this.http.put<Secretaria>(`${this.apiUrl}/${id}`, item)
  }

  deleteSecretariaItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
