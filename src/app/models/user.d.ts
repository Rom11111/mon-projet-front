import { UserRole } from './userRole.enum';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string; // Seulement pour l'authentification, pas pour l'affichage
    role: UserRole;
    photoUrl?: string;
    status: 'Active' | 'Inactive';
    createdAt?: Date;
    updatedAt?: Date;

}



