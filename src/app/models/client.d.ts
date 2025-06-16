import { User } from './user';

export interface Client extends User {
    company: string;
    companyAddress: string;
    // Autres propriétés spécifiques aux clients
}
