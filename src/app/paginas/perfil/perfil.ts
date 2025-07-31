import { Component } from '@angular/core';
import { DatosUsuario } from './datos-usuario/datos-usuario';
import { SeguridadUsuario } from './seguridad-usuario/seguridad-usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}
