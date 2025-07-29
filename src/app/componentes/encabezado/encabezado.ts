import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, CommonModule],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css'
})
export class Encabezado implements OnInit, OnDestroy{
  mostrarLogin: boolean = true;
  isAdmin: boolean = false;
  isCliente: boolean = false;
  private authSubscription: Subscription | undefined;;

  constructor(private router: Router, private authService: Auth) { }

  
  ngOnInit(): void {
    // Suscribirse a los cambios del estado de autenticación
    this.authSubscription = this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.mostrarLogin = !isAuthenticated; // Si no está autenticado, muestra el login
      if (isAuthenticated) {
        this.checkUserRole(); // Verificar el rol si está autenticado
      } else {
        this.isAdmin = false;
        this.isCliente = false;
      }
    });
  }

  checkUserRole(): void {
    const role = this.authService.getRole();
    if (role === 'Administrador') {
      this.isAdmin = true;
      this.isCliente = false;
    } else if (role === 'Cliente') {
      this.isAdmin = false;
      this.isCliente = true;
    }
  }

  logout(): void {
    this.authService.logout(); // Cerrar sesión
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
