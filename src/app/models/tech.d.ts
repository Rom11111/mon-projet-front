import { User } from './user.model';

export interface Tech extends User {
    specialization?: string;
    certifications?: string[];
    skills?: string[];
    availability?: string;
    // Autres propriétés spécifiques aux techniciens
}
