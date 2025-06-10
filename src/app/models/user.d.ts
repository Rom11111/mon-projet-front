
export type UserRole = 'CLIENT' | 'TECH' | 'ADMIN';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string; // Seulement pour l'authentification, pas pour l'affichage
    role: UserRole;
    photoUrl: string;
    status: 'Active' | 'Inactive';
}



