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
    status: string;          // "PENDING", "CONFIRMED", etc.
    confirmed?: boolean;
    isActive?: boolean;

    // Quantité louée
    quantity: number;

    // Objets complets optionnels (si envoyés par le back)
    product?: { name: string };
    user?: { firstname: string; lastname: string };

    // expirationDate?: string;
    // confirmed?: boolean;
    // isActive?: boolean;
}

