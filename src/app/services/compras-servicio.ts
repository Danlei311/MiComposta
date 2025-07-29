import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasServicio {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener los proveedores activos
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminProveedores/getProveedores`);
  }

  // Obtener los materiales de un proveedor
  getMaterialesDeProveedor(idProveedor: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminProveedores/getMateriales/${idProveedor}`);
  }

  // Método para realizar una compra
  comprarMaterial(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AdminCompras/comprarMaterial`, request);
  }

  // Obtener todas las compras
  getCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/AdminCompras/getCompras`);
  }

  // Obtener el detalle de una compra
  getDetalleCompra(idCompra: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AdminCompras/getDetalleCompra/${idCompra}`);
  }
}
