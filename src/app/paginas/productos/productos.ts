import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../services/productos-services';
import { MaterialesService } from '../../services/materiales-service';

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
  materialesProducto: any[] = [];
  materiales: any[] = [];
  materialSeleccionado: any = null;

  selectedProducto: any = { idProducto: 0, nombre: '', descripcion: '' };
  materialesObligatorios: string[] = ["Controlador WiFi", "Sensor de humedad", "Cables de conexión"];

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editProductoModal') editProductoModal!: TemplateRef<any>;
  @ViewChild('detalleProducto') detalleProductoModal!: TemplateRef<any>;

  constructor(
    private productoService: ProductosService,
    private modalService: NgbModal,
    private materialService: MaterialesService) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerMateriales();
  }

  open(content: any): void {
    this.materialesProducto = [];
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

  get materialesObligatoriosSeleccionados(): boolean {
    if (!this.materiales || !this.materialesProducto) return false;

    return this.materialesObligatorios.every(nombre => {
      const material = this.materiales.find(m => m.nombreVenta.trim().toLowerCase() === nombre.trim().toLowerCase());
      return material && this.materialesProducto.some(mp => +mp.idMaterial === +material.idMaterial);
    });
  }

  // Agregar este método para verificar si un material obligatorio está seleccionado
  esMaterialObligatorioSeleccionado(nombreMaterial: string): boolean {
    if (!this.materiales || !this.materialesProducto) return false;

    const material = this.materiales.find(m =>
      m.nombreVenta.trim().toLowerCase() === nombreMaterial.trim().toLowerCase()
    );

    return material && this.materialesProducto.some(mp => +mp.idMaterial === +material.idMaterial);
  }


  obtenerMateriales(): void {
    this.materialService.getMaterials().subscribe({
      next: (response) => {
        this.materiales = response;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los materiales.';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  registrarProducto(): void {
    const nuevoProducto = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      materiales: this.materialesProducto.map(mat => {
        const materialSeleccionado = this.materiales.find(m => m.idMaterial === mat.idMaterial);
        return {
          idMaterial: mat.idMaterial,
          nombre: materialSeleccionado?.nombre || '',
          cantidadRequerida: mat.cantidad
        };
      })
    };

    this.productoService.registrarProducto(nuevoProducto).subscribe({
      next: () => {
        this.successMessage = 'Producto registrado correctamente.';
        this.nombre = '';
        this.descripcion = '';
        this.materialesProducto = [];
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
        setTimeout(() => this.successMessage = '', 3700);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el producto.';
        setTimeout(() => this.errorMessage = '', 3500);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.obtenerProductos();
        setTimeout(() => this.successMessage = '', 3700);
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el producto.';
        setTimeout(() => this.errorMessage = '', 3500);
      }
    });
  }

  openEditModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.modalService.open(this.editProductoModal);
  }

  openDetalleModal(producto: any): void {
    this.selectedProducto = { ...producto };
    this.materialesProducto = producto.materiales.map((mat: any) => ({
      idMaterial: mat.idMaterial,
      cantidad: mat.cantidadRequerida,
      precio: mat.precio || 0
    }));
    this.modalService.open(this.detalleProductoModal, { size: 'lg' });
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

  eliminarMaterial(index: number) {
    this.materialesProducto.splice(index, 1);
  }

  agregarMaterial() {
    this.materialesProducto.push({ idMaterial: null, cantidad: 1, precio: 0 });
  }
}
