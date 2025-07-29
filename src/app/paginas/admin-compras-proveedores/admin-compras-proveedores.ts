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
export class AdminComprasProveedores implements OnInit{
  proveedores: any[] = [];  // Proveedores disponibles
  materiales: any[] = [];   // Materiales del proveedor seleccionado
  selectedProveedor: any = null;  // Proveedor seleccionado
  materialesCompra: any[] = [];   // Materiales que se agregan a la compra

  @ViewChild('compraModal') compraModal!: TemplateRef<any>;

  constructor(private modalService: NgbModal, private comprasService: ComprasServicio) { }

  ngOnInit(): void {
    this.obtenerProveedores();  // Obtener proveedores al inicio
  }

  // Abrir el modal para realizar una compra
  openCompraModal() {
    this.materialesCompra = [];  // Limpiar los materiales de la compra
    this.modalService.open(this.compraModal, {size: 'lg'});  // Abrir el modal
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
    const compra = {
      proveedorId: this.selectedProveedor,
      materiales: this.materialesCompra
    };

    // Aquí se enviaría el objeto `compra` al servidor para procesar la compra.
    console.log('Realizando compra:', compra);
    this.modalService.dismissAll();  // Cerrar el modal
  }

}
