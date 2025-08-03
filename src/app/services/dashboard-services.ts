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

  getUnidadesEnInventario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/AdminDashboard/getResumenInventario`);
  }

  getResumenVentas() {
    return this.http.get<{ cantidadVentas: number, totalIngresos: number }>(`${this.apiUrl}/AdminDashboard/getResumenVentas`);
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
