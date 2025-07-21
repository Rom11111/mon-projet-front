import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const notify = inject(NotificationService);

    const expectedRoles: string[] = route.data['roles'] || [];
    const userRole = auth.getUserRole();

    // ✅ Si l'utilisateur a un rôle accepté
    if (userRole && expectedRoles.includes(userRole)) {
        return true;
    }

    // ❌ Sinon, on bloque et on notifie
    notify.show("Accès refusé", 'error');
    router.navigateByUrl('/login');
    return false;
};

