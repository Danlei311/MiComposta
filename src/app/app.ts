import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Encabezado } from "./componentes/encabezado/encabezado";
import { Footer } from "./componentes/footer/footer";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MiComposta';
  constructor(public router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
