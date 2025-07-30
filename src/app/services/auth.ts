import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  apiUrl: string = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login/login`, request);
  }

  // Método para almacenar los datos del usuario en localStorage
  storeUserData(response: LoginResponse): void {
    localStorage.setItem('userId', response.idUsuario.toString());
    localStorage.setItem('role', response.rol);
    localStorage.setItem('nombre', response.nombre); // Asegúrate de incluir esto
    this.isAuthenticatedSubject.next(true);  // Notificar que el usuario está autenticado
  }

  // Método para limpiar los datos del usuario (logout)
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false);  // Notificar que el usuario ha cerrado sesión
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem('userId') !== null;
  }

  // Obtener el rol del usuario
  getRole(): string | null {
    return localStorage.getItem('role');
  }

}
