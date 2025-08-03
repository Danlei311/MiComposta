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

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login/login`, request);
  }



  // Método para almacenar los datos del usuario
  storeUserData(response: LoginResponse): void {
    localStorage.setItem('userId', response.idUsuario.toString());
    localStorage.setItem('role', response.rol);
    localStorage.setItem('nombre', response.nombre);
    const currentAuthState = true;
    if (this.previousAuthState !== currentAuthState) {
      this.isAuthenticatedSubject.next(currentAuthState);
      this.previousAuthState = currentAuthState;
    }
  }

  // Método para limpiar los datos del usuario (logout)
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    const currentAuthState = false;
    if (this.previousAuthState !== currentAuthState) {
      this.isAuthenticatedSubject.next(currentAuthState);
      this.previousAuthState = currentAuthState;
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId') && !!localStorage.getItem('role');
  }

  // Obtener el rol del usuario
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  hasRole(expectedRole: string): boolean {
    const userRole = this.getRole();
    return userRole === expectedRole;
  }

  private previousAuthState: boolean | null = null;

}
