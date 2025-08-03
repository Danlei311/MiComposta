import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const currentRoute = state.url;
  const userRole = authService.getRole();
  const isAuthenticated = authService.isAuthenticated();

  // Definición de rutas
  const publicRoutes = ['/', '/preguntas', '/contacto', '/login', '/sin-permisos'];
  const adminRoutes = [
    '/dashboard', '/adminUsuarios', '/proveedores',
    '/controlComentarios', '/comprasProveedores',
    '/materiales', '/productos', '/ventas'
  ];
  const clientRoutes = [
    '/perfil', '/perfilInicio', '/datosUsuario',
    '/seguridad', '/comprasCliente', '/documentacion'
  ];

  // Evitar bucles en redirecciones
  if (currentRoute === '/login' && isAuthenticated) {
    return getRedirectUrl(userRole, router);
  }

  // 1. Si es una ruta pública
  if (isPublicRoute(currentRoute, publicRoutes)) {
    if (isAuthenticated) {
      return getRedirectUrl(userRole, router);
    }
    return true;
  }

  // 2. Si no está autenticado, redirigir a login (excepto si ya está en login)
  if (!isAuthenticated && currentRoute !== '/login') {
    return router.createUrlTree(['/login']);
  }

  // 3. Verificar rutas de admin
  if (isAdminRoute(currentRoute, adminRoutes)) {
    return userRole === 'Administrador' 
      ? true 
      : router.createUrlTree(['/sin-permisos']);
  }

  // 4. Verificar rutas de cliente
  if (isClientRoute(currentRoute, clientRoutes)) {
    return userRole === 'Cliente' 
      ? true 
      : router.createUrlTree(['/sin-permisos']);
  }

  // 5. Para cualquier otra ruta no definida
  return isAuthenticated 
    ? getRedirectUrl(userRole, router)
    : router.createUrlTree(['/login']);
};


// Funciones auxiliares
function isPublicRoute(route: string, publicRoutes: string[]): boolean {
  return publicRoutes.some(publicRoute => route === publicRoute || 
         route.startsWith(publicRoute + '/'));
}

function isAdminRoute(route: string, adminRoutes: string[]): boolean {
  return adminRoutes.some(adminRoute => route === adminRoute || 
         route.startsWith(adminRoute + '/'));
}

function isClientRoute(route: string, clientRoutes: string[]): boolean {
  return clientRoutes.some(clientRoute => route === clientRoute || 
         route.startsWith(clientRoute + '/'));
}

function getRedirectUrl(userRole: string | null, router: Router): UrlTree {
  if (userRole === 'Administrador') {
    return router.createUrlTree(['/dashboard']);
  } else if (userRole === 'Cliente') {
    return router.createUrlTree(['/perfilInicio']);
  }
  return router.createUrlTree(['/']);
}
