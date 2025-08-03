import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-error404',
  imports: [CommonModule],
  templateUrl: './error404.html',
  styleUrl: './error404.css'
})
export class Error404 {
  rolUsuario: string | null = '';

  constructor(private router: Router, private authService: Auth) {
    this.rolUsuario = this.authService.getRole();
  }

  redirigirInicio() {
    if (this.rolUsuario === 'Administrador') {
      this.router.navigate(['/dashboard']);
    } else if (this.rolUsuario === 'Cliente') {
      this.router.navigate(['/perfilInicio']);
    } else {
      this.router.navigate(['/']);
    }
  }

  redirigirLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
