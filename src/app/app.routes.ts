import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Preguntas } from './paginas/preguntas/preguntas';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Dashboard } from './paginas/dashboard/dashboard';
import { Perfil } from './paginas/perfil/perfil';
import { AdminUsuarios } from './paginas/admin-usuarios/admin-usuarios';
import { AdminProveedores } from './paginas/admin-proveedores/admin-proveedores';
import { AdminComprasProveedores } from './paginas/admin-compras-proveedores/admin-compras-proveedores';
import { Materiales } from './paginas/materiales/materiales';
import { Productos } from './paginas/productos/productos';
import { PerfilInicio } from './paginas/perfil-inicio/perfil-inicio';
import { DatosUsuario } from './paginas/perfil/datos-usuario/datos-usuario';
import { SeguridadUsuario } from './paginas/perfil/seguridad-usuario/seguridad-usuario';
import { ComprasCliente } from './paginas/compras-cliente/compras-cliente';
import { Ventas } from './paginas/ventas/ventas';
import { ComentariosClientes } from './paginas/comentarios-clientes/comentarios-clientes';
import { DocumentacionProductos } from './paginas/documentacion-productos/documentacion-productos';
import { authGuard } from './auth/auth-guard';
import { Error404 } from './paginas/error404/error404';

export const routes: Routes = [
    // Rutas públicas (sin autenticación)
    { path: '', component: Inicio },
    { path: 'preguntas', component: Preguntas },
    { path: 'contacto', component: Contacto },
    { path: 'login', component: Login },

    // Rutas de administrador (requieren autenticación y rol Admin)
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'adminUsuarios',
        component: AdminUsuarios,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'proveedores',
        component: AdminProveedores,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'controlComentarios',
        component: ComentariosClientes,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'comprasProveedores',
        component: AdminComprasProveedores,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'materiales',
        component: Materiales,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'productos',
        component: Productos,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },
    {
        path: 'ventas',
        component: Ventas,
        canActivate: [authGuard],
        data: { expectedRole: 'Administrador' }
    },

    // Rutas de cliente (requieren autenticación y rol Cliente)
    {
        path: 'perfil',
        component: Perfil,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },
    {
        path: 'perfilInicio',
        component: PerfilInicio,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },
    {
        path: 'datosUsuario',
        component: DatosUsuario,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },
    {
        path: 'seguridad',
        component: SeguridadUsuario,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },
    {
        path: 'comprasCliente',
        component: ComprasCliente,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },
    {
        path: 'documentacion',
        component: DocumentacionProductos,
        canActivate: [authGuard],
        data: { expectedRole: 'Cliente' }
    },

    // Página de sin permisos
    { path: 'sin-permisos', component: Error404 },

    // Ruta por defecto (404)
    { path: '**', redirectTo: '' }
];
