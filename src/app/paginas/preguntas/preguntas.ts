import { Component, OnInit } from '@angular/core';
import { ComentariosPublicosServicio } from '../../services/comentarios-publicos-servicio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas',
  imports: [CommonModule],
  templateUrl: './preguntas.html',
  styleUrl: './preguntas.css'
})
export class Preguntas implements OnInit{
  comentarios: any[] = [];

  constructor(private comentariosService: ComentariosPublicosServicio) { }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.comentariosService.getComentariosVisibles().subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
      }
    });
  }

  getStars(valoracion: number): string {
    return '★'.repeat(valoracion) + '☆'.repeat(5 - valoracion);
  }

}
