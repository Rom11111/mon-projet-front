import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Auth } from '../models/auth';
import { Role } from '../models/Role.enum';
import { User } from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    connected = false;
    role: Role | null = null;
    private apiUrl = `${environment.serverUrl}/api/auth`;


    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Vérification supplémentaire pour la production
        if (environment.production) {
            // Désactive les console.log en production
            console.log = () => {};
            console.error = () => {};
        }

        const jwt = localStorage.getItem("jwt");
        if (jwt && !this.isTokenExpired()) {
            this.decodeJwt(jwt);
        }
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    register(userData: Auth.RegistrationData): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                if (response?.token) {
                    this.decodeJwt(response.token);
                }
            }),
            catchError(error => {
                console.error('Erreur lors de l\'inscription', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Connecte un utilisateur existant
     */
    signIn(credentials: Auth.LoginData): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response?.token) {
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
    private decodeJwt(jwt: string): void {
        localStorage.setItem("jwt", jwt);

        try {
            const splitJwt = jwt.split(".");
            const jwtBody = splitJwt[1];
            const jsonBody = atob(jwtBody);
            const body = JSON.parse(jsonBody) as Auth.JwtPayload;

            this.role = body.role;
            this.connected = true;
            this.refreshUserData();
        } catch (error) {
            console.error('Erreur lors du décodage du JWT', error);
            this.signOut();
        }
    }

    /**
     * Vérifie si le token JWT est expiré
     */
    private isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const jwt = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= jwt.exp * 1000;
        } catch {
            return true;
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
        return this.connected && !this.isTokenExpired();
    }

    /**
     * Rafraîchit les données utilisateur depuis le token ou l'API
     */
    private refreshUserData(): void {
        const jwt = this.getToken();
        if (!jwt) {
            this.currentUserSubject.next(null);
            return;
        }

        try {
            const splitJwt = jwt.split(".");
            if (splitJwt.length !== 3) {
                this.handleAuthError('Format JWT invalide');
                return;
            }

            const userData = JSON.parse(atob(splitJwt[1])) as Auth.JwtPayload;

            if (!userData.sub || !userData.email || !userData.role) {
                this.handleAuthError('Données JWT incomplètes');
                return;
            }

            const userId = Number(userData.sub);

            this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
                timeout(5000),
                catchError(error => {
                    console.error('Erreur lors de la récupération des données utilisateur', error);
                    return of({
                        id: userId,
                        email: userData.email,
                        firstname: '',
                        lastname: '',
                        password: '',
                        role: userData.role,
                        photoUrl: '',
                        userStatus: 'Active',
                        company: '',
                        companyAddress: '',
                        phone: ''
                    } as User);
                })
            ).subscribe({
                next: (user) => this.currentUserSubject.next(user),
                error: (error) => this.handleAuthError(error)
            });

        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Gestion centralisée des erreurs d'authentification
     */
    private handleAuthError(error: any): void {
        console.error('Erreur d\'authentification:', error);
        this.currentUserSubject.next(null);
    }

    /**
     * Récupère les informations de l'utilisateur courant
     */
    getCurrentUser(): Observable<User | null> {
        if (this.currentUserSubject.value) {
            return of(this.currentUserSubject.value);
        }
        this.refreshUserData();
        return this.currentUser$;
    }

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     */
    hasRole(requiredRole: Role): boolean {
        return this.role === requiredRole;
    }

    /**
     * Vérifie si l'utilisateur a l'un des rôles requis
     */
    hasAnyRole(requiredRoles: Role[]): boolean {
        return this.role !== null && requiredRoles.includes(this.role);
    }

    /**
     * Redirige l'utilisateur vers son tableau de bord en fonction de son rôle
     */
    async redirectBasedOnRole(): Promise<boolean> {
        if (!this.isLoggedIn()) {
            return await this.router.navigate(['/login']);
        }

        const roleRoutes = {
            [Role.ADMIN]: '/dashboard',
            [Role.TECH]: '/dashboard',
            [Role.CLIENT]: '/dashboard'
        };

        try {
            return await this.router.navigate([roleRoutes[this.role as Role] || '/login']);
        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
            return false;
        }
    }
}
