import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo material
  registerMaterial(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AdminMaterial/register`, request);
  }

  // Método para obtener todos los materiales activos
  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminMaterial/getMaterials`);
  }

  // Método para eliminar un material
  deleteMaterial(materialId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/AdminMaterial/deleteMaterial/${materialId}`, {});
  }

  // Método para actualizar un material
  updateMaterial(material: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/AdminMaterial/updateMaterial/${material.idMaterial}`, material);
  }
  
}
