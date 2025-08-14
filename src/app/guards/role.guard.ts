import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const notify = inject(NotificationService);

    // Rôles autorisés déclarés sur la route (ex: data: { roles: ['ADMIN', 'TECH'] })
    const expectedRoles: string[] = route.data['roles'] || [];

    // Rôle actuel de l'utilisateur (ex: 'ADMIN' | 'TECH' | 'CLIENT' | null)
    const userRole = auth.getUserRole();

    // Si la route n'exige pas de rôles spécifiques → on laisse passer tout utilisateur connecté
    if (!expectedRoles.length) {
        return true;
    }

    // ✅ Si l'utilisateur possède l'un des rôles attendus → accès autorisé
    if (userRole && expectedRoles.includes(userRole)) {
        return true;
    }

    /// ❌ Accès refusé → on notifie puis on redirige (choisis '/unauthorized' ou '/login')
    notify.show('Accès refusé', 'error');
    router.navigateByUrl('/unauthorized'); // ou '/login' si tu préfères
    return false;
};

