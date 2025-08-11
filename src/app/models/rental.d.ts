import { RentalStatus } from './rental-status';

export interface Rental {
    id: number;
    clientId: number;
    productId: number;

    startDate?: Date;
    endDate?: Date;

    statut: RentalStatus;

    reservationDate?: Date;
    expirationDate?: Date;

    confirmed?: boolean;
    isActive?: boolean;
    quantity: number;

    product?: { name: string };
    user?: { firstname: string; lastname: string };

}

