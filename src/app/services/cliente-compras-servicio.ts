import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteComprasServicio {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCotizacionesPendientes(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ClienteCompras/cotizacionesPendientes/${idUsuario}`);
  }

  cancelarCotizacion(idCotizacion: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/ClienteCompras/cancelarCotizacion/${idCotizacion}`, {});
  }

  procesarPago(datosPago: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ClienteCompras/procesarPago`, datosPago);
  }

  getVentasPorUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ClienteCompras/misCompras/${idUsuario}`);
  }

  guardarComentario(comentario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ClienteCompras/guardarComentario`, comentario);
  }
}
