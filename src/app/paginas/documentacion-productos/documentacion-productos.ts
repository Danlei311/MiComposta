import { Component } from '@angular/core';
import { DocumentacionServicio } from '../../services/documentacion-servicio';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentacion-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './documentacion-productos.html',
  styleUrl: './documentacion-productos.css'
})
export class DocumentacionProductos {
  resultados: any[] = [];
  isLoading: boolean = true;

  constructor(private documentacionService: DocumentacionServicio) { }

  ngOnInit(): void {
    this.cargarDocumentacion();
  }

  cargarDocumentacion(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar al usuario',
        confirmButtonColor: '#254635'
      });
      this.isLoading = false;
      return;
    }

    this.documentacionService.verificarCompras(parseInt(userId)).subscribe({
      next: (response) => {
        this.resultados = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar documentación:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los documentos',
          confirmButtonColor: '#254635'
        });
        this.isLoading = false;
      }
    });
  }
}
