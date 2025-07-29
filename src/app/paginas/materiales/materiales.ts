import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialesService } from '../../services/materiales-service';

@Component({
  selector: 'app-materiales',
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales.html',
  styleUrl: './materiales.css'
})
export class Materiales implements OnInit {
  nombre: string = '';
  unidadMedida: string = 'Unidad';
  errorMessage: string = '';
  successMessage: string = '';
  materiales: any[] = [];
  searchTerm: string = '';
  filteredMaterials: any[] = [];
  selectedMaterial: any = { nombre: '', unidadMedida: 'Unidad' };;

  constructor(private materialService: MaterialesService, private modalService: NgbModal) { }

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editMaterialModal') editMaterialModal!: TemplateRef<any>;

  ngOnInit(): void {
    this.obtenerMateriales();  // Cargar los materiales al iniciar
  }

  open(content: any) {
    this.modalService.open(content);
  }

  openEditModal(material: any): void {
    this.selectedMaterial = {
      nombre: material.nombre,
      unidadMedida: material.unidadMedida || 'Unidad'  // Asegura que 'unidadMedida' no sea nulo
    };
    this.modalService.open(this.editMaterialModal);
  }

  obtenerMateriales(): void {
    this.materialService.getMaterials().subscribe({
      next: (response) => {
        this.materiales = response;
        this.filteredMaterials = this.materiales;  // Inicialmente muestra todos los materiales
      },
      error: (err) => {
        console.error('Error al obtener los materiales:', err);
        this.errorMessage = 'Hubo un error al cargar los materiales.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  registrarMaterial(): void {
    const newMaterial = {
      nombre: this.nombre,
      unidadMedida: this.unidadMedida
    };

    this.materialService.registerMaterial(newMaterial).subscribe({
      next: (response) => {
        this.successMessage = 'Material registrado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerMateriales();  // Recargar la lista de materiales
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al registrar el material.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  deleteMaterial(materialId: number): void {
    this.materialService.deleteMaterial(materialId).subscribe({
      next: () => {
        this.successMessage = 'Material eliminado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerMateriales();  // Recargar la lista de materiales
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al eliminar el material.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  confirmDelete(modal: any): void {
    if (this.selectedMaterial) {
      this.deleteMaterial(this.selectedMaterial.idMaterial);
      modal.close();
    }
  }

  updateMaterial(): void {
    const updatedMaterial = {
      ...this.selectedMaterial,
      nombre: this.selectedMaterial.nombre,
      unidadMedida: this.selectedMaterial.unidadMedida
    };

    this.materialService.updateMaterial(updatedMaterial).subscribe({
      next: () => {
        this.successMessage = 'Material actualizado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerMateriales();  // Recargar la lista de materiales
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al actualizar el material.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  // Método para editar un material
  editMaterial(material: any): void {
    this.selectedMaterial = { ...material }; // Hacemos una copia del material para editar
    this.modalService.open(this.editMaterialModal); // Abrimos el modal de edición
  }

  // Método para abrir el modal de confirmación de eliminación
  openDeleteConfirmation(material: any): void {
    this.selectedMaterial = material; // Asignamos el material a eliminar
    this.modalService.open(this.confirmDeleteModal); // Abrimos el modal de confirmación
  }

  filterMaterials(): void {
    this.filteredMaterials = this.materiales.filter(material =>
      material.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      material.unidadMedida.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
