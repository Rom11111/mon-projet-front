import { Role } from './user.model';

export declare namespace Auth {
    /**
     * Données pour la connexion
     */
    interface LoginData {
        email: string;
        password: string;
    }

    /**
     * Données pour l'inscription
     */
    interface RegistrationData {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: Role;  // Optionnel si un rôle par défaut est attribué par l'API
    }

    /**
     * Format du JWT décodé (minimal)
     */
    interface JwtPayload {
        sub: string | number;  // Identifiant utilisateur
        email: string;
        role: Role;
        exp: number;          // Timestamp d'expiration
        userId: number;
    }
}

