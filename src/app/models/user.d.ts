import { Role } from './role.enum';
import { UserStatus } from './user-status.enum';

// Version allégée pour le front (sans données sensibles)
export interface User{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    photoUrl?: string;
    userStatus: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
    company: string;
    companyAddress: string;
    phone: string;
}




