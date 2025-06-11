import {Injectable} from '@angular/core';
import {Observable, of, throwError, BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';


// Importez les interfaces depuis votre fichier auth.d.ts

import {Auth} from '../models/auth';
import {UserRole} from '../models/userRole.enum';
import {User} from '../models/user';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // BehaviorSubject pour stocker l'utilisateur courant
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    connected = false;
    role: UserRole | null = null;
    private apiUrl = 'api/auth';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Initialise l'état de l'authentification
        const jwt = localStorage.getItem("jwt");
        if (jwt != null) {
            this.decodeJwt(jwt);
        }
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    register(userData: Auth.RegistrationData): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
            catchError(error => {
                console.error('Erreur lors de l\'inscription', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Connecte un utilisateur existant
     */
    signIn(credentials: Auth.LoginData): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    this.decodeJwt(response.token);
                }
            }),
            catchError(error => {
                console.error('Erreur lors de la connexion', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Décode le JWT et met à jour l'état de l'utilisateur
     */
    public decodeJwt(jwt: string): void {
        localStorage.setItem("jwt", jwt);

        try {
            const splitJwt = jwt.split(".");
            const jwtBody = splitJwt[1];
            const jsonBody = atob(jwtBody);
            const body = JSON.parse(jsonBody) as Auth.JwtPayload;

            this.role = body.role;
            this.connected = true;

            // Mettre à jour l'utilisateur courant
            this.refreshUserData();
        } catch (error) {
            console.error('Erreur lors du décodage du JWT', error);
            this.signOut();
        }
    }

    /**
     * Déconnecte l'utilisateur
     */
    signOut(): void {
        localStorage.removeItem("jwt");
        this.connected = false;
        this.role = null;
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    /**
     * Récupère le token JWT
     */
    getToken(): string | null {
        return localStorage.getItem("jwt");
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isLoggedIn(): boolean {
        return this.connected;
    }

    /**
     * Rafraîchit les données utilisateur depuis le token ou l'API
     */
    private refreshUserData(): void {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            this.currentUserSubject.next(null);
            return;
        }

        try {
            // Extraire les données de base du JWT
            const splitJwt = jwt.split(".");
            const jwtBody = splitJwt[1];
            const jsonBody = atob(jwtBody);
            const userData = JSON.parse(jsonBody) as Auth.JwtPayload;

            // Créer un utilisateur avec les informations minimales disponibles dans le JWT
            // Puisque firstname et lastname ne sont pas dans le JWT,
            // nous allons récupérer les informations complètes depuis l'API
            const userId = Number(userData.sub);

            // Récupérer les informations complètes de l'utilisateur depuis l'API
            this.http.get<User>(`${this.apiUrl}/users/${userId}`).subscribe(
                user => {
                    this.currentUserSubject.next(user);
                },
                error => {
                    console.error('Erreur lors de la récupération des données utilisateur', error);

                    // En cas d'erreur, on crée un utilisateur avec les informations minimales
                    const minimalUser: User = {
                        id: userId,
                        email: userData.email,
                        firstname: '',  // Information non disponible dans le JWT
                        lastname: '',   // Information non disponible dans le JWT
                        password: '',   // Ne jamais stocker le mot de passe
                        role: userData.role,
                        photoUrl: '',   // Information non disponible dans le JWT
                        status: 'Active'
                    };

                    this.currentUserSubject.next(minimalUser);
                }
            );
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur', error);
            this.currentUserSubject.next(null);
        }
    }

    /**
     * Récupère les informations de l'utilisateur courant
     */
    getCurrentUser(): Observable<User | null> {
        // Si l'utilisateur est déjà chargé, on le retourne
        if (this.currentUserSubject.value) {
            return of(this.currentUserSubject.value);
        }

        // Sinon, on essaie de le charger
        this.refreshUserData();
        return this.currentUser$;
    }

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     */
    hasRole(requiredRole: UserRole): boolean {
        return this.role === requiredRole;
    }

    /**
     * Vérifie si l'utilisateur a l'un des rôles requis
     */
    hasAnyRole(requiredRoles: UserRole[]): boolean {
        return this.role !== null && requiredRoles.includes(this.role);
    }

    /**
     * Redirige l'utilisateur vers son tableau de bord en fonction de son rôle
     */
    async redirectBasedOnRole(): Promise<boolean> {
        if (!this.isLoggedIn()) {
            return await this.router.navigate(['/login']);
        }

        try {
            switch (this.role) {
                case UserRole.ADMIN:
                    return await this.router.navigate(['/admin']);
                case UserRole.TECH:
                    return await this.router.navigate(['/tech']);
                case UserRole.CLIENT:
                    return await this.router.navigate(['/client']);
                default:
                    return await this.router.navigate(['/login']);
            }
        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
            return false;
        }
    }
}
