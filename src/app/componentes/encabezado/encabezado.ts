import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, Subscription } from 'rxjs';
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
  private authSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: Auth) { }

  
  ngOnInit(): void {
    this.checkAuthState();
    
    this.authSubscription = this.authService.isAuthenticated$
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.checkAuthState();
      });
  }

  checkAuthState(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    this.mostrarLogin = !isAuthenticated;
    
    if (isAuthenticated) {
      const role = this.authService.getRole();
      this.isAdmin = role === 'Administrador';
      this.isCliente = role === 'Cliente';
    } else {
      this.isAdmin = false;
      this.isCliente = false;
    }
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
    this.authSubscription?.unsubscribe();
  }

}
