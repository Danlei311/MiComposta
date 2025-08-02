import { Component } from '@angular/core';
import { ControlComentariosServicio } from '../../services/control-comentarios-servicio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentarios-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios-clientes.html',
  styleUrl: './comentarios-clientes.css'
})
export class ComentariosClientes {
  comentarios: any[] = [];
  filteredComentarios: any[] = [];
  searchTerm: string = '';
  estadoFiltro: string = 'Pendiente';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private comentariosService: ControlComentariosServicio) { }

  ngOnInit(): void {
    this.obtenerComentarios();
  }

  obtenerComentarios(): void {
    this.comentariosService.getComentarios().subscribe({
      next: (response) => {
        this.comentarios = response;
        this.filtrarPorEstado(); // Aplicar filtro inicial
      },
      error: (err) => {
        console.error('Error al obtener los comentarios:', err);
        this.mostrarError('Hubo un error al cargar los comentarios.');
      }
    });
  }

  filtrarPorEstado(): void {
    // Primero filtramos por estado
    this.filteredComentarios = this.comentarios.filter(comentario =>
      comentario.estado === this.estadoFiltro
    );

    // Luego aplicamos el filtro de búsqueda si hay término
    if (this.searchTerm) {
      this.filterComentarios();
    }
  }

  filterComentarios(): void {
    this.filteredComentarios = this.comentarios
      .filter(comentario => comentario.estado === this.estadoFiltro) // Primero por estado
      .filter(comentario =>
        comentario.texto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comentario.nombreProducto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (comentario.comprador.nombre + ' ' + comentario.comprador.apellido).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comentario.comprador.correo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comentario.idVenta.toString().includes(this.searchTerm)
      );
  }

  cambiarEstadoComentario(idComentario: number, nuevoEstado: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${nuevoEstado === 'Visible' ? 'mostrar' : 'ocultar'} este comentario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#254635',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comentariosService.updateEstadoComentario(idComentario, nuevoEstado).subscribe({
          next: () => {
            this.mostrarExito(`Comentario ${nuevoEstado === 'Visible' ? 'mostrado' : 'ocultado'} correctamente.`);
            this.obtenerComentarios(); // Recargar datos
          },
          error: (err) => {
            console.error('Error al cambiar estado:', err);
            this.mostrarError('Hubo un error al cambiar el estado del comentario.');
          }
        });
      }
    });
  }

  private mostrarExito(mensaje: string): void {
    Swal.fire({
      title: 'Éxito',
      text: mensaje,
      icon: 'success',
      confirmButtonColor: '#254635'
    });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#254635'
    });
  }
}
