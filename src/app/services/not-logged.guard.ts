import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Garde qui empêche les utilisateurs déjà connectés d'accéder à certaines pages
 * comme la page de connexion ou d'inscription.
 * Si l'utilisateur est connecté, il sera redirigé vers le tableau de bord.
 */
export const notLoggedGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);


    // Ajoutez un console.log pour déboguer
    console.log('NotLoggedGuard - État de connexion:', authService.connected);

    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil ou le tableau de bord
    if (authService.connected) {
        return router.createUrlTree(['/dashboard']);
    }

    // Sinon, autoriser l'accès à la page
    return true;
};
