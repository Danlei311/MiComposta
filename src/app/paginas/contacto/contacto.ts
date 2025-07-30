import { Component, OnInit } from '@angular/core';
import { CotizacionServicio } from '../../services/cotizacion-servicio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto implements OnInit {

  productos: any[] = [];  // Para almacenar los productos obtenidos
  materiales: any[] = [];  // Para almacenar los materiales del producto seleccionado
  selectedProducto: number = 0;  // Para almacenar el producto seleccionado
  selectedMateriales: any[] = [];  // Para almacenar los materiales seleccionados

  constructor(private cotizacionService: CotizacionServicio) { }

  ngOnInit(): void {
    this.obtenerProductos();  // Al iniciar, obtener los productos
  }

  // Obtener los productos y sus materiales
  obtenerProductos() {
    this.cotizacionService.getProductosConMateriales().subscribe({
      next: (response) => {
        this.productos = response;  // Guardamos los productos
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
      }
    });
  }

  // Cargar materiales al seleccionar un producto
  cargarMateriales() {
    const productoSeleccionado = this.productos.find(p => p.IdProducto === this.selectedProducto);
    if (productoSeleccionado) {
      this.materiales = productoSeleccionado.Materiales;
    }
  }

  // Agregar o eliminar materiales seleccionados
  toggleMaterial(idMaterial: number) {
    if (this.selectedMateriales.includes(idMaterial)) {
      this.selectedMateriales = this.selectedMateriales.filter(m => m !== idMaterial);
    } else {
      this.selectedMateriales.push(idMaterial);
    }
  }

  // Realizar la cotización (puedes manejar los datos como desees)
  realizarCotizacion() {
    const cotizacion = {
      productoId: this.selectedProducto,
      materiales: this.selectedMateriales
    };
    console.log('Cotización:', cotizacion);
    // Aquí puedes hacer la lógica para enviar la cotización al backend si es necesario
  }
}
