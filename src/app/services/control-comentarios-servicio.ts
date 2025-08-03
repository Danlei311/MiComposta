import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlComentariosServicio {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para obtener todos los comentarios
  getComentarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminComentariosControl/comentarios-detallados`);
  }

  // Método para actualizar el estado de un comentario
  updateEstadoComentario(idComentario: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/AdminComentariosControl/actualizar-estado/${idComentario}`, { estado: nuevoEstado });
  }
  
}
