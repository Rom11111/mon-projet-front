import { RentalStatus } from './rental-status.enum';

export interface RentalResponse {
    id: number;

    // Liens vers entités
    clientId: number;
    productId: number;

    // Infos produit / client à plat pour l’affichage direct
    productName: string;
    clientFirstname: string;
    clientLastname: string;

    // Période
    startDate: string;       // ISO format string
    endDate: string;
    reservationDate: string;

    // Statut et états
    statut: RentalStatus;        // "PENDING", "CONFIRMED", etc.
    confirmed?: boolean;
    isActive?: boolean;

    price: number;           // Prix unitaire par jour
    total: number;           // Prix total calculé

    // Quantité louée
    quantity: number;

    // Objets complets optionnels (si envoyés par le back)
    product?: { name: string };
    user?: { firstname: string; lastname: string };

    // expirationDate?: string;
    // confirmed?: boolean;
    // isActive?: boolean;
}

