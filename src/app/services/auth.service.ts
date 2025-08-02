import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Indique si l'utilisateur est connecté
    connected = false;

    // Stocke le rôle de l'utilisateur (ex : 'CLIENT', 'ADMIN', 'TECH')
    role: string | null = null;


    constructor(private http: HttpClient) {
        // Si un JWT est déjà présent dans le localStorage, on le décode pour récupérer le rôle
        const jwt = localStorage.getItem("jwt")
        if (jwt != null) {
            this.decodeJwt(jwt)
        }
    }


    login(credentials: { email: string; password: string }): Observable<string> {
        // L’intercepteur ajoutera le serverUrl automatiquement
        return this.http.post('login', credentials, { responseType: 'text' });
    }


    /**
     * Décode le JWT reçu (au login) et extrait le rôle
     * @param jwt Le token JWT sous forme de chaîne
     */
    decodeJwt(jwt: string) {
        localStorage.setItem("jwt", jwt)

        //on découpe le jwt en 3 parties séparées par un point
        const splitJwt = jwt.split(".");

        //on récupère la partie "body" du jwt
        const jwtBody = splitJwt[1]

        // On décode le corps du JWT depuis la base64
        const jsonBody = atob(jwtBody)

        // On transforme la chaîne JSON en objet JS
        const body = JSON.parse(jsonBody)

        // On extrait le rôle et on l'enregistre dans le service
        this.role = body.role;

        // On indique que l'utilisateur est connecté
        this.connected = true;
    }

    /**
     * Renvoie le rôle actuel de l'utilisateur
     * @returns 'CLIENT', 'ADMIN', 'TECH' ou null
     */
    getUserRole(): string | null {
        return this.role;
    }

    /**
     * Déconnecte l'utilisateur en supprimant le JWT
     */
    logout() {
        localStorage.removeItem("jwt")
        this.connected = false
        this.role = null
    }

}
