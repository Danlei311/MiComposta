import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosPublicosServicio {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getComentariosVisibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminComentariosControl/comentarios-visibles`);
  }
  
}
