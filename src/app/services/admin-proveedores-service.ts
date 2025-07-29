import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProveedoresService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo proveedor
  registerProveedor(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AdminProveedores/register`, request);
  }

  // Método para obtener todos los proveedores activos
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminProveedores/getProveedores`);
  }

  // Método para eliminar un proveedor
  deleteProveedor(proveedorId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/AdminProveedores/deleteProveedor/${proveedorId}`, {});
  }

  // Método para actualizar un proveedor
  updateProveedor(proveedor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/AdminProveedores/updateProveedor/${proveedor.idProveedor}`, proveedor);
  }

  // Método para obtener materiales activos
  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminMaterial/getMaterials`);
  }

  // Método para asignar materiales a un proveedor
  asignarMateriales(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AdminProveedores/asignarMateriales`, request);
  }

  // Método para obtener los materiales de un proveedor específico
  getMaterialesPorProveedor(idProveedor: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminProveedores/getMateriales/${idProveedor}`);
  }


}
