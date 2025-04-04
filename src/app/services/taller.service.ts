import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TallerService {


  private apiUrl = 'https://back-prueba-dem.onrender.com/taller'; // Cambia esto si es necesario
  //private apiUrl = 'http://localhost:3000/taller';
  constructor(private http: HttpClient) { }

  getTaller(): Observable<any> {
    const url = `${this.apiUrl}/taller`;
    
    return this.http.get(url);
}
createTaller(taller: any): Observable<any> {
  return this.http.post(this.apiUrl, taller);
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
}
