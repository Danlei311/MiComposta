import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminProveedoresService } from '../../services/admin-proveedores-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-proveedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-proveedores.html',
  styleUrl: './admin-proveedores.css'
})
export class AdminProveedores implements OnInit {
  nombre: string = '';
  correo: string = '';
  telefono: string = '';
  direccion: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  proveedores: any[] = [];
  searchTerm: string = '';
  filteredProveedores: any[] = [];
  selectedProveedor: any = null;

  materiales: any[] = []; // Lista de materiales
  selectedMaterials: any[] = []; // Materiales seleccionados

  constructor(private proveedorService: AdminProveedoresService, private modalService: NgbModal) { }

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editProveedorModal') editProveedorModal!: TemplateRef<any>;

  @ViewChild('asignarMaterialesModal') asignarMaterialesModal!: TemplateRef<any>;
  @ViewChild('materialesProveedorModal') materialesProveedorModal!: TemplateRef<any>;

  ngOnInit(): void {
    this.obtenerProveedores();  // Cargar los proveedores al iniciar
    this.obtenerMateriales();
  }

  open(content: any) {
    this.modalService.open(content);
  }

  openEditModal(proveedor: any): void {
    this.selectedProveedor = { ...proveedor };  // Crea una copia del proveedor a editar
    this.modalService.open(this.editProveedorModal);
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (response) => {
        this.proveedores = response;
        this.filteredProveedores = this.proveedores;  // Inicialmente muestra todos los proveedores
      },
      error: (err) => {
        console.error('Error al obtener los proveedores:', err);
        this.errorMessage = 'Hubo un error al cargar los proveedores.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  registrarProveedor(): void {
    const newProveedor = {
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      direccion: this.direccion
    };

    this.proveedorService.registerProveedor(newProveedor).subscribe({
      next: (response) => {
        this.successMessage = 'Proveedor registrado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerProveedores();  // Recargar la lista de proveedores
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al registrar el proveedor.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }


  deleteProveedor(proveedorId: number): void {
    this.proveedorService.deleteProveedor(proveedorId).subscribe({
      next: () => {
        this.successMessage = 'Proveedor eliminado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerProveedores();  // Recargar la lista de proveedores
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al eliminar el proveedor.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  confirmDelete(modal: any): void {
    if (this.selectedProveedor) {
      this.deleteProveedor(this.selectedProveedor.idProveedor);
      modal.close();
    }
  }

  updateProveedor(): void {
    const updatedProveedor = {
      ...this.selectedProveedor,
      nombre: this.selectedProveedor.nombre,
      correo: this.selectedProveedor.correo,
      telefono: this.selectedProveedor.telefono,
      direccion: this.selectedProveedor.direccion
    };

    this.proveedorService.updateProveedor(updatedProveedor).subscribe({
      next: () => {
        this.successMessage = 'Proveedor actualizado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerProveedores();  // Recargar la lista de proveedores
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al actualizar el proveedor.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  // Método para editar un proveedor
  editProveedor(proveedor: any): void {
    this.selectedProveedor = { ...proveedor };
    if (this.editProveedorModal) {
      this.modalService.open(this.editProveedorModal);
    }
  }

  // Método para abrir el modal de confirmación de eliminación
  openDeleteConfirmation(proveedor: any): void {
    this.selectedProveedor = proveedor;
    if (this.confirmDeleteModal) {
      this.modalService.open(this.confirmDeleteModal);
    }
  }

  filterProveedores(): void {
    this.filteredProveedores = this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      proveedor.correo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      proveedor.telefono.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      proveedor.direccion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  // Metodos para el manejo de materiales con proveedores -------------------------------------------

  // Método para abrir el modal y cargar los materiales
  openAsignarMaterialesModal(proveedor: any): void {
    // Asegurarse de que selectedProveedor tenga los datos del proveedor seleccionado
    this.selectedProveedor = proveedor;  // Asignar el proveedor al modal
    this.selectedMaterials = []; // Limpiar la selección previa de materiales
    this.modalService.open(this.asignarMaterialesModal); // Abrir el modal
  }

  // Obtener los materiales activos desde el servicio
  obtenerMateriales(): void {
    this.proveedorService.getMaterials().subscribe({
      next: (response) => {
        this.materiales = response; // Asignamos los materiales a la variable
      },
      error: (err) => {
        console.error('Error al obtener los materiales:', err);
      }
    });
  }

  // Método para verificar si un material está seleccionado
  isMaterialSelected(material: any): boolean {
    return this.selectedMaterials.some(m => m.idMaterial === material.idMaterial);
  }

  // Método para agregar o quitar materiales de la selección
  toggleMaterialSelection(material: any): void {
    const index = this.selectedMaterials.findIndex(m => m.idMaterial === material.idMaterial);
    if (index === -1) {
      this.selectedMaterials.push(material); // Agregar material
    } else {
      this.selectedMaterials.splice(index, 1); // Eliminar material
    }
  }

  // Método para guardar los materiales seleccionados
  guardarMaterialesSeleccionados(): void {
    // Verificar si se ha seleccionado un proveedor antes de intentar acceder a su id
    if (!this.selectedProveedor || !this.selectedProveedor.idProveedor) {
      this.errorMessage = 'Debe seleccionar un proveedor primero.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
      return; // No continuar si no hay proveedor seleccionado
    }

    // Obtener el id del proveedor
    const idProveedor = this.selectedProveedor.idProveedor;

    // Crear el objeto que vamos a enviar a la API
    const request = {
      idProveedor: idProveedor,
      idMateriales: this.selectedMaterials.map(material => material.idMaterial)
    };

    // Llamada a la API para asignar los materiales
    this.proveedorService.asignarMateriales(request).subscribe({
      next: (response) => {
        console.log('Materiales asignados:', response);
        this.successMessage = response.message; // Mensaje de éxito
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      },
      error: (err) => {
        console.error('Error al asignar materiales:', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message; // Mostrar el mensaje de error
        } else {
          this.errorMessage = 'Hubo un error al asignar los materiales.';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }


  materialesProveedor: any[] = [];  // Array para almacenar los materiales de un proveedor

  // Método para obtener los materiales de un proveedor específico
  verMaterialesProveedor(proveedor: any): void {
    this.proveedorService.getMaterialesPorProveedor(proveedor.idProveedor).subscribe({
      next: (response) => {
        this.materialesProveedor = response.materiales; // Asignar los materiales al array
        this.modalService.open(this.materialesProveedorModal);  // Abrir el modal
      },
      error: (err) => {
        console.error('Error al obtener los materiales del proveedor:', err);
        this.errorMessage = 'Hubo un error al cargar los materiales.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }


}
