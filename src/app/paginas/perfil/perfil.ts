import { Component } from '@angular/core';
import { DatosUsuario } from './datos-usuario/datos-usuario';
import { SeguridadUsuario } from './seguridad-usuario/seguridad-usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilDeUsuarioService } from '../../services/perfilUser-service';

@Component({
  selector: 'app-perfil',
  imports: [DatosUsuario, SeguridadUsuario, CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  activeTab: 'perfil' | 'seguridad' = 'perfil';

  switchTab(tab: 'perfil' | 'seguridad') {
    this.activeTab = tab;
  }

  idUsuario: number = 0;

  cliente = {
    nombreCompleto: '',
    correo: '',
    telefono: ''
  };

  constructor(private perfilService: PerfilDeUsuarioService) { }

  ngOnInit(): void {
  const userIdStr = localStorage.getItem('userId');
  this.idUsuario = userIdStr ? +userIdStr : 0;
  if (this.idUsuario > 0) {
    this.obtenerDatosUsuario();
  } else {
    console.warn('ID de usuario inválido o no encontrado en localStorage.');
  }

  this.perfilService.actualizarDatos$.subscribe(actualizar => {
    if (actualizar) {
      this.obtenerDatosUsuario();
    }
  });
}

  obtenerDatosUsuario() {
    this.perfilService.getPerfilUsuario(this.idUsuario).subscribe({
      next: res => {
        this.cliente = res || {
          nombreCompleto: res.nombreCompleto || '',
          correo: res.correo || '',
          telefono: res.telefono || ''
        };
      },
      error: err => {
        console.error('Error al obtener datos del usuario:', err);
      }
    });
  }

  get iniciales(): string {
    const partes = this.cliente.nombreCompleto.trim().split(' ');
    return partes.length >= 2
      ? partes[0][0] + partes[1][0]
      : partes[0]?.[0] ?? '';
  }


}
