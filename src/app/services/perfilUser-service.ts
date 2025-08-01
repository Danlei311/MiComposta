import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PerfilDeUsuarioService {
  private actualizarDatosSource = new BehaviorSubject<boolean>(false);
  actualizarDatos$ = this.actualizarDatosSource.asObservable();

  notificarActualizacion() {
    this.actualizarDatosSource.next(true);
  }

  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  actualizarInfoUser(id: number, info: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ClientePerfil/actualizarClientInfo/${id}`, info);
  }

  cambiarContrasenia(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ClientePerfil/cambiarContrasenia/${id}`, data);
  }

  getPerfilUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ClientePerfil/infoClient/${id}`);
  }
}