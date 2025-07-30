import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CotizacionServicio {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener productos con sus materiales
  getProductosConMateriales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminProducto/getProductosConMateriales`);
  }
}
