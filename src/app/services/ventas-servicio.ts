import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasServicio {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCotizacionesProceso(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminVentas/cotizacionesProceso`);
  }

  cancelarCotizacion(idCotizacion: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/AdminVentas/cancelarCotizacion/${idCotizacion}`, {});
  }

  completarVenta(idCotizacion: number, idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AdminVentas/completarVenta/${idCotizacion}?idUsuario=${idUsuario}`, {});
  }

  getVentasCompletadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminVentas/ventasCompletadas`);
  }
}
