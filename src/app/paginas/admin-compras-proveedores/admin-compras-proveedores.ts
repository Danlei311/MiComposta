import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComprasServicio } from '../../services/compras-servicio';

@Component({
  selector: 'app-admin-compras-proveedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-compras-proveedores.html',
  styleUrl: './admin-compras-proveedores.css'
})
export class AdminComprasProveedores implements OnInit {
  proveedores: any[] = [];  // Proveedores disponibles
  materiales: any[] = [];   // Materiales del proveedor seleccionado
  selectedProveedor: any = null;  // Proveedor seleccionado
  materialesCompra: any[] = [];   // Materiales que se agregan a la compra
  compras: any[] = [];  // Lista de compras
  detalleCompra: any[] = [];  // Detalle de la compra
  selectedCompra: any = null;  // Compra seleccionada
  fechaFiltro: string = '';  // Variable para almacenar la fecha seleccionada
  comprasFiltradas: any[] = [];  // Lista de compras filtradas

  @ViewChild('compraModal') compraModal!: TemplateRef<any>;
  @ViewChild('detalleCompraModal') detalleCompraModal!: TemplateRef<any>;

  constructor(private modalService: NgbModal, private comprasService: ComprasServicio) { }

  ngOnInit(): void {
    this.obtenerCompras();
    this.obtenerProveedores();  // Obtener proveedores al inicio
  }

  // Abrir el modal para realizar una compra
  openCompraModal() {
    this.materialesCompra = [];  // Limpiar los materiales de la compra
    this.modalService.open(this.compraModal, { size: 'lg' });  // Abrir el modal
  }

  // Obtener los proveedores
  obtenerProveedores() {
    this.comprasService.getProveedores().subscribe({
      next: (response) => {
        this.proveedores = response;
      },
      error: (err) => {
        console.error('Error al obtener los proveedores:', err);
      }
    });
  }

  // Cargar los materiales del proveedor seleccionado
  cargarMaterialesProveedor() {
    if (!this.selectedProveedor) return;
    this.comprasService.getMaterialesDeProveedor(this.selectedProveedor).subscribe({
      next: (response) => {
        this.materiales = response.materiales;
      },
      error: (err) => {
        console.error('Error al obtener materiales del proveedor:', err);
      }
    });
  }

  // Agregar una fila para un nuevo material
  agregarMaterial() {
    this.materialesCompra.push({ idMaterial: null, cantidad: 1, precio: 0 });
  }

  // Eliminar una fila de material
  eliminarMaterial(index: number) {
    this.materialesCompra.splice(index, 1);
  }

  // Realizar la compra
  realizarCompra() {
    // Crear el objeto que vamos a enviar
    const compra = {
      IdProveedor: this.selectedProveedor, // Enviar el ID del proveedor seleccionado
      Materiales: this.materialesCompra.map(material => ({
        IdMaterial: material.idMaterial,
        Cantidad: material.cantidad,
        PrecioUnitario: material.precio
      }))
    };

    // Llamar al servicio para realizar la compra
    this.comprasService.comprarMaterial(compra).subscribe({
      next: (response) => {
        console.log('Compra realizada exitosamente:', response);
        this.modalService.dismissAll();  // Cerrar el modal
        this.obtenerCompras(); // Recargar la tabla después de la compra
      },
      error: (err) => {
        console.error('Error al realizar la compra:', err);
      }
    });
  }

  // Obtener las compras
  obtenerCompras() {
    this.comprasService.getCompras().subscribe({
      next: (response) => {
        console.log("Compras obtenidas:", response);  // Verifica la respuesta
        this.compras = response;  // Asignamos la lista de compras
        this.comprasFiltradas = this.compras;
      },
      error: (err) => {
        console.error('Error al obtener las compras:', err);
      }
    });
  }

  // Abrir el modal de detalle de compra
  openDetalleCompraModal(idCompra: number) {
    this.comprasService.getDetalleCompra(idCompra).subscribe({
      next: (response) => {
        this.detalleCompra = response;
        this.modalService.open(this.detalleCompraModal);
      },
      error: (err) => {
        console.error('Error al obtener el detalle de la compra:', err);
      }
    });
  }

  // Filtrar compras por fecha
  filtrarPorFecha() {
    if (this.fechaFiltro) {
      this.comprasFiltradas = this.compras.filter(compra =>
        this.esMismaFecha(compra.fechaCompra, this.fechaFiltro)
      );
    } else {
      this.comprasFiltradas = this.compras;
    }
  }

  // Mostrar todas las compras
  mostrarTodasCompras() {
    this.fechaFiltro = '';  // Limpiar el filtro de fecha
    this.comprasFiltradas = this.compras;  // Mostrar todas las compras
  }

  private esMismaFecha(fechaA: string | Date, fechaB: string | Date): boolean {
    // fechaA viene como "2025-07-28T20:27:43.233"
    // fechaB viene como "2025-07-28" (input type="date")
    const a = new Date(fechaA);
    const [yearB, monthB, dayB] = typeof fechaB === 'string'
      ? fechaB.split('-').map(Number)
      : [fechaB.getFullYear(), fechaB.getMonth() + 1, fechaB.getDate()];

    return a.getFullYear() === yearB &&
      (a.getMonth() + 1) === monthB &&
      a.getDate() === dayB;
  }

}
