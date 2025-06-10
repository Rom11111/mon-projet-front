// auth.d.ts
import { UserRole } from './user.model';

declare namespace Auth {
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
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        role?: UserRole;  // Optionnel si un rôle par défaut est attribué par l'API
    }

    /**
     * Format du JWT décodé (minimal)
     */
    interface JwtPayload {
        sub: string | number;  // Identifiant utilisateur
        email: string;
        role: UserRole;
        exp: number;          // Timestamp d'expiration
    }
}
