import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: Auth, private router: Router) { }

  onSubmit(): void {
    const loginData: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe(
      (response) => {
        // Almacenar los datos del usuario en localStorage
        this.authService.storeUserData(response);

        // Redirigir según el rol
        const role = response.rol;
        if (role === 'Administrador') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'Cliente') {
          this.router.navigate(['/perfil']);
        }
      },
      (error) => {
        if (error.status === 401 && error.error === 'El usuario ha sido desactivado.') {
          this.errorMessage = 'Tu cuenta ha sido desactivada. Contacta con el administrador.';
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        }
      }
    );
  }

}
