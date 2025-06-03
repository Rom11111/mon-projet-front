export interface Rental {
    id: number;
    clientId: number;        // ID de l'utilisateur (User)
    productId: number;       // ID du produit (Product)
    date: Date;              // Date de la location
    heureDebut?: string;     // Pourrait être dérivé de reservationDate
    heureFin?: string;       // Pourrait être dérivé de expirationDate
    statut: 'confirmé' | 'en attente' | 'annulé'; // Dérivé de confirmed
    reservationDate?: Date;  // Ajout pour correspondre au backend
    expirationDate?: Date;   // Ajout pour correspondre au backend
    confirmed?: boolean;     // État brut de confirmation
    isActive?: boolean;      // État d'activité
}
