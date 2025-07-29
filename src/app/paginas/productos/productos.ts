import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../services/productos-services';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  nombre: string = '';
  descripcion: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  productos: any[] = [];
  filteredProductos: any[] = [];
  searchTerm: string = '';

  selectedProducto: any = { idProducto: 0, nombre: '', descripcion: '' };

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editProductoModal') editProductoModal!: TemplateRef<any>;

  constructor(private productoService: ProductosService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  open(content: any): void {
    this.modalService.open(content);
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductosActivos().subscribe({
      next: (response) => {
        this.productos = response;
        this.filteredProductos = response;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los productos.';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  registrarProducto(): void {
    const nuevoProducto = {
      nombre: this.nombre,
      descripcion: this.descripcion
    };

    this.productoService.registrarProducto(nuevoProducto).subscribe({
      next: () => {
        this.successMessage = 'Producto registrado correctamente.';
        this.nombre = '';
        this.descripcion = '';
        this.obtenerProductos();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: () => {
        this.errorMessage = 'Error al registrar el producto.';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  modificarProducto(): void {
    const productoActualizado = {
      nombre: this.selectedProducto.nombre,
      descripcion: this.selectedProducto.descripcion
    };

    this.productoService.modificarProducto(this.selectedProducto.idProducto, productoActualizado).subscribe({
      next: () => {
        this.successMessage = 'Producto actualizado correctamente.';
        this.obtenerProductos();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el producto.';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.obtenerProductos();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el producto.';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  openEditModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.modalService.open(this.editProductoModal);
  }

  openDeleteConfirmation(producto: any): void {
    this.selectedProducto = producto;
    this.modalService.open(this.confirmDeleteModal);
  }

  confirmDelete(modal: any): void {
    this.eliminarProducto(this.selectedProducto.idProducto);
    modal.close();
  }

  filterProductos(): void {
    this.filteredProductos = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
