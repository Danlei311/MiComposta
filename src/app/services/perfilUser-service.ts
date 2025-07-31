import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PerfilDeUsuarioService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  actualizarInfoUser(id: number, info: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ClientePerfil/actualizarClientInfo/${id}`, info);
  }

  cambiarContrasenia(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ClientePerfil/cambiarContrasenia/${id}`, data);
  }
}