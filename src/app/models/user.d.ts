import { Role } from './Role.enum';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string; // Seulement pour l'authentification, pas pour l'affichage
    role: Role;
    photoUrl?: string;
    userStatus: 'Active' | 'Inactive';
    createdAt?: Date;
    updatedAt?: Date;
    company: string;
    companyAddress: string;
    phone: string;
    emailVerificationToken?: string;
}




