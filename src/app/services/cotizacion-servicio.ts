import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CotizacionServicio {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener productos con sus materiales
  getProductosYMateriales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Cotizacion/getProductosYMateriales`);
  }

  calcularCotizacionPrevia(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Cotizacion/calcularCotizacionPrevia`, data);
  }

  realizarCotizacion(cotizacionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Cotizacion/realizarCotizacion`, cotizacionData);
  }
}
