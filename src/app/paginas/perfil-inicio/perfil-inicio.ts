import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-inicio',
  imports: [],
  templateUrl: './perfil-inicio.html',
  styleUrl: './perfil-inicio.css'
})
export class PerfilInicio {
  nombreCliente: string = '';

  ngOnInit(): void {
    this.nombreCliente = localStorage.getItem('nombre') || 'Cliente';
  }
}
