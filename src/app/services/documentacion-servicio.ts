import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionServicio {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  verificarCompras(idUsuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ClienteDocumentacionProductos/verificar-compras/${idUsuario}`);
  }
}
