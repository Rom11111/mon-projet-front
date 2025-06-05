import { Injectable } from '@angular/core';
import {J} from '@angular/cdk/keycodes';
import {Observable, of, throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    connected = false
    role: string | null = null

    constructor() {
        const jwt = localStorage.getItem("jwt")
        if (jwt != null) {
            this.decodeJwt(jwt)
        }
    }
        decodeJwt(jwt: string){
            localStorage.setItem("jwt", jwt)

            // On découpe le jwt en 3 parties séparées par un point
            const splitJwt = jwt.split(".");
            // On récupère la partie "body du jwt
            const jwtBody = splitJwt[1]
            // On décode la base 64
            const jsonBody = atob(jwtBody)
            // On transforme le json en objet js
            const body = JSON.parse(jsonBody)


            this.role = body.role;

            this.connected = true

        }

        signOut(){
            localStorage.removeItem("jwt")
            this.connected = false
            this.role = null
        }

    // Nouvelle méthode pour récupérer les informations de l'utilisateur courant
    getCurrentUser(): Observable<any> {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            return of(null); // Retourne null si pas de JWT
        }

        try {
            // Réutilisation de la logique existante pour décoder le JWT
            const splitJwt = jwt.split(".");
            const jwtBody = splitJwt[1];
            const jsonBody = atob(jwtBody);
            const userData = JSON.parse(jsonBody);

            // Retourne un Observable contenant les données utilisateur
            return of({
                // Adaptez ces champs selon la structure réelle de votre JWT
                id: userData.sub || userData.id,
                firstName: userData.firstName || userData.given_name,
                lastName: userData.lastName || userData.family_name,
                displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                email: userData.email,
                role: userData.role
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur', error);
            return throwError(() => new Error('Erreur de décodage du JWT'));
        }
    }

}
