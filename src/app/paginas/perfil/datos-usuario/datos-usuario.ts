import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilDeUsuarioService } from '../../../services/perfilUser-service';

@Component({
  selector: 'app-datos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-usuario.html',
  styleUrl: './datos-usuario.css'
})
export class DatosUsuario implements OnInit {
  idUsuario: number = 0;

  cliente = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  };

  constructor(private perfilService: PerfilDeUsuarioService) { }

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    this.idUsuario = userIdStr ? +userIdStr : 0;
    console.log('ID de usuario cargado:', this.idUsuario);
  }

  mensajeExito: string = '';

  actualizarInfo() {
    this.perfilService.actualizarInfoUser(this.idUsuario, {
      name: this.cliente.nombre,
      lastName: this.cliente.apellido,
      email: this.cliente.email,
      phone: this.cliente.telefono
    }).subscribe({
      next: res => {
        this.mensajeExito = res.message || '¡Datos actualizados con éxito! 🎉';
        setTimeout(() => this.mensajeExito = '', 3500);
      },
      error: err => {
        alert(err.error?.message || 'Error al actualizar datos');
      }
    });
  }
}
