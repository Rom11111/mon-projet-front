import { User } from './user.model';

export interface Client extends User {
    company: string;
    companyAddress: string;
    // Autres propriétés spécifiques aux clients
}
