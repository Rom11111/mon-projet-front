import { User } from './user.model';

export interface Admin extends User {
    permissions?: string[];
    departement?: string;
    // Autres propriétés spécifiques aux administrateurs
}
