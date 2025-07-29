import { Injectable } from "@angular/core";
import { Productos } from '../paginas/productos/productos';
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ProductosService {
    apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) { }

    // Método para registrar un nuevo producto
    registrarProducto(request: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/AdminProducto/addProducto`, request)
    }

    // Método para obtener todos los productos activos
    obtenerProductosActivos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/AdminProducto/getProductosConMateriales`);
    }

    // Método para modificar un producto
    modificarProducto(id: number, producto: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/updateProducto/${id}`, producto);
    }


    // Método para eliminar un producto
    eliminarProducto(productoId: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/AdminProducto/deleteProducto/${productoId}`, {});
    }
}