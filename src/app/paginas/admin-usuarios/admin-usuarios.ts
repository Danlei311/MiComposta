import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Usuarios } from '../../services/usuarios';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterRequest } from '../../interfaces/register-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterResponse } from '../../interfaces/register-response';

@Component({
  selector: 'app-admin-usuarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuarios implements OnInit {
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  telefono: string = '';
  rol: string = '';
  contrasena: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  usuarios: any[] = [];  // Aquí guardamos todos los usuarios
  searchTerm: string = ''; // Barra de búsqueda
  filteredUsuarios: any[] = [];  // Aquí guardamos los usuarios filtrados
  selectedUser: any = null;


  constructor(private usuarioService: Usuarios, private modalService: NgbModal) { }

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;
  @ViewChild('editUserModal') editUserModal!: TemplateRef<any>;


  ngOnInit(): void {
    this.obtenerUsuarios();  // Al cargar el componente, obtenemos los usuarios
  }

  // Método para abrir el modal
  open(content: any) {
    this.modalService.open(content);
  }

  // Método para abrir el modal de edición
  openEditModal(user: any): void {
    this.selectedUser = { ...user };  // Creamos una copia para editar sin afectar el objeto original
    this.modalService.open(this.editUserModal);
  }

  // Método para obtener todos los usuarios activos
  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response;  // Asignamos la respuesta a 'usuarios'
        this.filteredUsuarios = this.usuarios;  // Inicialmente, mostramos todos los usuarios
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.errorMessage = 'Hubo un error al cargar los usuarios.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  // Método para registrar un nuevo usuario
  registrarUsuario(): void {

    const newUser: RegisterRequest = {
      name: this.nombre,
      lastName: this.apellido,
      email: this.correo,
      phone: this.telefono,
      role: this.rol,
      password: this.contrasena || null // Si no se proporciona contraseña, se enviará `undefined`
    };

    this.usuarioService.registerUsuario(newUser).subscribe({
      next: (response: RegisterResponse) => {
        // Manejo de la respuesta del servidor
        this.successMessage = response.message;  // Solo usas el mensaje del backend
        this.errorMessage = '';  // Limpiar mensaje de error
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerUsuarios();  // Recargar la lista de usuarios
      },
      error: (err) => {
        // Manejo del error específico de correo duplicado
        if (err.status === 400 && err.error.success === false) {
          this.errorMessage = err.error.message;  // Mostrar el mensaje de error
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        } else {
          this.errorMessage = 'Hubo un error al registrar el usuario.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }

        this.successMessage = '';
      }
    });
  }
  // Método para abrir el modal de confirmación antes de eliminar
  openDeleteConfirmation(user: any): void {
    this.selectedUser = user;  // Asignamos el usuario seleccionado
    this.modalService.open(this.confirmDeleteModal);  // Abrimos el modal de confirmación
  }

  // Método para eliminar un usuario
  deleteUser(userId: number): void {
    this.usuarioService.deleteUser(userId).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerUsuarios();
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al eliminar el usuario.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  // Método que se ejecuta cuando el usuario confirma la eliminación
  confirmDelete(modal: any): void {
    if (this.selectedUser) {
      this.deleteUser(this.selectedUser.idUsuario);
      modal.close();  // Cerramos el modal
    }
  }

  filterUsuarios(): void {
    this.filteredUsuarios = this.usuarios.filter(user =>
      user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Método para actualizar los datos del usuario
  updateUser(): void {
    const updatedUser = {
      ...this.selectedUser,
      name: this.selectedUser.nombre,
      lastName: this.selectedUser.apellido,
      email: this.selectedUser.correo,
      phone: this.selectedUser.telefono,
      role: this.selectedUser.rol,
      // Mantener la contraseña si no ha sido cambiada (deberías añadir un campo para cambiarla si es necesario)
    };

    this.usuarioService.updateUser(updatedUser).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente.';
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
        this.obtenerUsuarios();  // Recargamos la lista de usuarios
      },
      error: (err) => {
        if (err.status === 400 && err.error.message === "El correo electrónico ya está en uso por otro usuario.") {
          this.errorMessage = 'El correo electrónico ya está en uso por otro usuario.';
        } else {
          this.errorMessage = 'Hubo un error al actualizar el usuario.';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    });
  }

  // Método para editar un usuario
  editUser(user: any): void {
    console.log('Editar usuario:', user);
    this.openEditModal(user);  // Abre el modal de edición
  }
}
