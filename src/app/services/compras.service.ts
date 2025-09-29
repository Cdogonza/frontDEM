import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../envairoment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private equipameinto =environment.apiUrl+'/equipamiento';
  private mantenimiento =environment.apiUrl+'/mantenimiento';
  private motores =environment.apiUrl+'/motores';
  private equipamiento_equipos = environment.apiUrl+'/equipamiento_equipos'

  constructor(private http: HttpClient) { }

  addEquipamiento(equipamiento: any): Observable<any> {
    const url = `${this.equipameinto}`;
    return this.http.post(url, equipamiento);
  }
  
  getEquipamiento(): Observable<any> {
    const url = `${this.equipameinto}`;

    return this.http.get(url);
}
getMantenimiento(): Observable<any> {
  const url = `${this.mantenimiento}`;
  return this.http.get(url);
}
getMotores(): Observable<any> {
  const url = `${this.motores}`;
  return this.http.get(url);
}

getEquipamientobyTrimestre(trimestre: string): Observable<any> {
  const url = `${this.equipameinto}/trimestre/${trimestre}`;
  return this.http.get(url);
}
getMantenimientobyTrimestre(trimestre: string): Observable<any> {
  const url = `${this.mantenimiento}/trimestre/${trimestre}`;
  return this.http.get(url);
}
getMotoresbyTrimestre(trimestre: string): Observable<any> {
  const url = `${this.motores}/trimestre/${trimestre}`;
  return this.http.get(url);
}

// Método para actualizar una compra
    updateCompra(id: number, compraData: any): Observable<any> {
  const url = `${this.equipameinto}/${id}`;
  console.log(url);
  console.log(compraData);
  console.log(id);
  return this.http.put(url, compraData);
}

// Método para actualizar compra de mantenimiento
updateCompraMantenimiento(id: number, compraData: any): Observable<any> {
  const url = `${this.mantenimiento}/${id}`;
  return this.http.put(url, compraData);
}

// Método para actualizar compra de motores
updateCompraMotores(id: number, compraData: any): Observable<any> {
  const url = `${this.motores}/${id}`;
  return this.http.put(url, compraData);
}

// Métodos de búsqueda para equipamiento
buscarPorNumero(numero: string): Observable<any> {
  const url = `${this.equipameinto}/buscar/numero/${numero}`;
  return this.http.get(url);
}

buscarPorNombre(nombre: string): Observable<any> {
  const url = `${this.equipameinto}/buscar/nombre/${nombre}`;
  return this.http.get(url);
}

buscarCombinada(numero: string, nombre: string): Observable<any> {
  const url = `${this.equipameinto}/buscar/combinada`;
  const params = { numero, nombre };
  return this.http.get(url, { params });
}

// Métodos de búsqueda para mantenimiento
buscarMantenimientoPorNumero(numero: string): Observable<any> {
  const url = `${this.mantenimiento}/buscar/numero/${numero}`;
  return this.http.get(url);
}

buscarMantenimientoPorNombre(nombre: string): Observable<any> {
  const url = `${this.mantenimiento}/buscar/nombre/${nombre}`;
  return this.http.get(url);
}

buscarMantenimientoCombinada(numero: string, nombre: string): Observable<any> {
  const url = `${this.mantenimiento}/buscar/combinada`;
  const params = { numero, nombre };
  return this.http.get(url, { params });
}

// Métodos de búsqueda para motores
buscarMotoresPorNumero(numero: string): Observable<any> {
  const url = `${this.motores}/buscar/numero/${numero}`;
  return this.http.get(url);
}

buscarMotoresPorNombre(nombre: string): Observable<any> {
  const url = `${this.motores}/buscar/nombre/${nombre}`;
  return this.http.get(url);
}

buscarMotoresCombinada(numero: string, nombre: string): Observable<any> {
  const url = `${this.motores}/buscar/combinada`;
  const params = { numero, nombre };
  return this.http.get(url, { params });
}

get_equipamiento_equipos(): Observable<any> {
  const url = `${this.equipamiento_equipos}`;
  return this.http.get(url);

}
//crear metodo para obtener equipos pasando un id_equipamiento como parametro
getEquiposPorIdEquipamiento(id_equipamiento: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/${id_equipamiento}`;
  return this.http.get(url);
}


// Métodos para obtener una compra específica por ID
getEquipamientoPorId(id: string): Observable<any> {
  const url = `${this.equipameinto}/${id}`;
  return this.http.get(url);
}
createEquipo_Equipamiento(equipo: any): Observable<any> {
  const url = `${this.equipamiento_equipos}`;
  
  return this.http.post(url, {equipo});
}

updateEquipo_Equipamiento(id: string, equipo: any): Observable<any> {
  const url = `${this.equipamiento_equipos}/${id}`;
  return this.http.put(url, {equipo});
}

deleteEquipo_Equipamiento(id: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/${id}`;
  return this.http.delete(url);
}






getMantenimientoPorId(id: string): Observable<any> {
  const url = `${this.mantenimiento}/${id}`;
  return this.http.get(url);
}

getMotoresPorId(id: string): Observable<any> {
  const url = `${this.motores}/${id}`;
  return this.http.get(url);
}

// Método para subir anexo/documento
subirAnexo(id_compra: string, archivo: File): Observable<any> {
  const url = `${this.equipamiento_equipos}/anexo/${id_compra}`;
  
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('id_compra', id_compra);
  
  return this.http.post(url, formData);
}

// Método para obtener anexos de una compra
getAnexos(id_compra: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/anexo/${id_compra}`;
  return this.http.get(url);
}

// Método para obtener la URL de preview de un anexo
getUrlPreviewAnexo(id_anexo: string): string {
  return `${this.equipamiento_equipos}/anexo/preview/${id_anexo}`;
}

// Método para obtener la URL de preview usando ruta de archivo
getUrlPreviewByPath(filePath: string): string {
  const baseUrl = environment.apiUrl;
  
  // Si es una ruta relativa, construir la URL completa
  if (filePath.startsWith('/') || filePath.startsWith('./')) {
    return `${baseUrl}${filePath}`;
  }
  
  // Si ya es una URL completa, usarla directamente
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Si es una ruta de archivo local, construir URL del servidor
  return `${baseUrl}/files/${filePath}`;
}

// Método para descargar un anexo
descargarAnexo(id_anexo: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/anexo/download/${id_anexo}`;
  return this.http.get(url, { responseType: 'blob' });
}

// Método para abrir un archivo en el explorador del sistema (backend)
abrirArchivoEnSistema(rutaArchivo: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/anexo/abrir`;
  return this.http.post(url, { rutaArchivo });
}

// Método para ejecutar comando del sistema operativo
ejecutarComandoSistema(idAnexo: number): void {
// Abre el archivo en una nueva pestaña
window.open(`${this.equipamiento_equipos}/anexo/servir/${idAnexo}`, '_blank');
}

// Método para eliminar un anexo
deleteAnexo(id_anexo: string): Observable<any> {
  const url = `${this.equipamiento_equipos}/anexo/${id_anexo}`;
  return this.http.delete(url);
}

}
