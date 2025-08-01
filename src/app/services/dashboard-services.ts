import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getClientesActivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getCantClientesActivos`);
  }

  getInversion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getInversionInventario`)
  }

  getGananciasTotales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getGananciasTotales`);
  }

  getComprasTotales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getSumaTotalCompras`);
  }

  getProveedoresMasComprados(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getProveedoresMasComprados`);
  }

  getTendenciaComprasPorMes(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getTendenciaComprasPorMes?desde=${desde}&hasta=${hasta}`);
  }

  getTopComprasAltas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getTopComprasAltas`);
  }

  getResumenCotizaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getResumenCotizaciones`);
  }
  getTendenciaVentasPorMes(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getTendenciaVentasPorMes?desde=${desde}&hasta=${hasta}`);
  }
  
  getGananciasMensuales(): Observable<any> {
  return this.http.get(`${this.apiUrl}/AdminDashboard/getGananciasMensuales`);
}

}
