// src/app/components/redirect/redirect.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-redirect',
    template: '<div class="loading">Redirection en cours...</div>',
    styles: ['.loading { display: flex; justify-content: center; align-items: center; height: 100vh; }']
})
export class RedirectComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    /**
     * Initialisation du composant avec gestion asynchrone des redirections
     */
    async ngOnInit(): Promise<void> {
        try {
            // Utilisation de la méthode redirectBasedOnRole() améliorée
            // qui retourne maintenant une promesse
            const navigationSuccess = await this.authService.redirectBasedOnRole();

            if (!navigationSuccess) {
                // Si la navigation a échoué pour une raison quelconque
                console.warn('La redirection n\'a pas pu être effectuée');
            }
        } catch (error) {
            // Gestion des erreurs potentielles
            console.error('Erreur lors de la redirection:', error);
            try {
                // Redirection de secours vers la page de connexion en cas d'erreur
                await this.router.navigate(['/login']);
            } catch (navError) {
                console.error('Erreur de navigation vers /login après erreur:', navError);
            }
        }
    }
}
