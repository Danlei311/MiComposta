import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../interfaces/register-request';
import { RegisterResponse } from '../interfaces/register-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuarios {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo usuario
  registerUsuario(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Administrador/register`, request);
  }

  // Método para obtener los usuarios activos
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Administrador/getUsuarios`);
  }

  // Método para eliminar un usuario lógicamente (actualizar 'Activo' a false)
  deleteUser(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Administrador/deleteUser/${userId}`, {});
  }

  // Método para actualizar un usuario
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Administrador/updateUser/${user.idUsuario}`, user);
  }

  getUsuariosPendientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Administrador/getUsuariosPendientes`);
  }

  aprobarUsuario(idUsuario: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/Administrador/procesarSolicitud/${idUsuario}`,
      {
        IdCotizacion: data.idCotizacion,
        Accion: 'aprobar'
      }
    );
  }

  rechazarUsuario(idUsuario: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/Administrador/procesarSolicitud/${idUsuario}`,
      {
        IdCotizacion: data.idCotizacion,
        Accion: 'rechazar'
      }
    );
  }

}
