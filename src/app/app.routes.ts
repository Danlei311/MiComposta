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

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'preguntas', component: Preguntas },
    { path: 'contacto', component: Contacto },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard },
    { path: 'adminUsuarios', component: AdminUsuarios },
    { path: 'proveedores', component: AdminProveedores },
    { path: 'comprasProveedores', component: AdminComprasProveedores },
    { path: 'materiales', component: Materiales },
    { path: 'productos', component: Productos },
    { path: 'perfil', component: Perfil },
    { path: 'perfilInicio', component: PerfilInicio },
    { path: 'datosUsuario',  component: DatosUsuario},
    {path: 'seguridad', component: SeguridadUsuario},
    { path: '**', redirectTo: '' }
];
