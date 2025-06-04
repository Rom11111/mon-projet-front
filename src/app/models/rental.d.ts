export interface Rental {
    id: number;
    clientId: number;
    productId: number;
    date: Date;
    heureDebut?: string;
    heureFin?: string;
    statut: 'confirmé' | 'en attente' | 'annulé';
    reservationDate?: Date;
    expirationDate?: Date;
    confirmed?: boolean;
    isActive?: boolean;
    user?: { firstname: string; lastname: string };
    product?: { name: string };
    startDate?: Date;
    endDate?: Date;
}

