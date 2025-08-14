import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Guard qui bloque l'accès si l'utilisateur :
 * - n'est pas connecté (pas de JWT)
 * - OU n'a pas le rôle attendu (via route.data.roles[])
 */
export const loggedGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        return router.parseUrl('/login'); // Non connecté → redirigé vers /login
    }

    const expectedRoles: string[] = route.data['roles'];
    const role: string | null = authService.getUserRole(); // peut être null

    // Si un rôle est attendu et qu'on n'en a pas ou qu'il ne correspond pas
    if (expectedRoles && (!role || !expectedRoles.includes(role))) {
        return router.parseUrl('/unauthorized'); // Accès refusé
    }

    return true; // ✅ Accès autorisé
};
