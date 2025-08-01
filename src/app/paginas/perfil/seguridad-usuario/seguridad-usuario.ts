import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilDeUsuarioService } from '../../../services/perfilUser-service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-seguridad-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './seguridad-usuario.html',
  styleUrl: './seguridad-usuario.css'
})
export class SeguridadUsuario {
  constructor(private perfilService: PerfilDeUsuarioService) { }

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    this.idUsuario = userIdStr ? +userIdStr : 0;
    console.log('ID de usuario cargado:', this.idUsuario);
  }

  idUsuario: number = 0;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  mensajeCambio: string = '';
  errorCambio: string = '';

  // Variables para controlar la visibilidad de las contraseñas
  verActual: boolean = false;
  verNueva: boolean = false;
  verConfirmar: boolean = false;

  // Método para alternar la visibilidad de las contraseñas
  togglePasswordVisibility(campo: string): void {
    switch(campo) {
      case 'actual':
        this.verActual = !this.verActual;
        break;
      case 'nueva':
        this.verNueva = !this.verNueva;
        break;
      case 'confirmar':
        this.verConfirmar = !this.verConfirmar;
        break;
    }
  }

  cambiarContrasena() {
    this.mensajeCambio = '';
    this.errorCambio = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorCambio = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }

    this.perfilService.cambiarContrasenia(this.idUsuario, {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: res => {
        this.mensajeCambio = res.message || 'Contraseña actualizada correctamente.';
        this.currentPassword = this.newPassword = this.confirmPassword = '';
        // Resetear la visibilidad de las contraseñas
        this.verActual = this.verNueva = this.verConfirmar = false;
        setTimeout(() => this.mensajeCambio = '', 5000);
      },
      error: err => {
        this.errorCambio = err.error?.message || 'Error al cambiar la contraseña.';
      }
    });
  }
}