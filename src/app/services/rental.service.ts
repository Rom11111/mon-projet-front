import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Rental } from '../models/rental';
import { RentalResponse } from '../models/rental-response';
import {RentalRequest} from '../models/RentalRequest';
import {ApiResponse} from '../models/api-response';
import {RentalStatus} from '../models/rental-status';


// Service injectable partout dans l’app
@Injectable({
    providedIn: 'root'
})
export class RentalService {
    // URL de base pour les appels API liés aux locations
    private apiUrl = 'rentals';

    constructor(private http: HttpClient) {}

    // Récupère toutes les locations (admin/tech)
    getAllRentals(): Observable<ApiResponse<RentalResponse[]>> {
        return this.http.get<ApiResponse<RentalResponse[]>>(this.apiUrl);
    }

    // Récupère les locations du client connecté
    getClientRentals(): Observable<RentalResponse[]> {
        return this.http.get<RentalResponse[]>(this.apiUrl);
    }

    // Récupère une location précise par ID
    getRentalById(id: number): Observable<Rental> {
        return this.http.get<Rental>(`${this.apiUrl}/${id}`);
    }

    // Crée une nouvelle location (POST)
    createRental(rental: RentalRequest): Observable<RentalResponse> {
        return this.http.post<RentalResponse>(this.apiUrl, rental);
    }

    // Met à jour une location existante (PUT)
    updateRental(rental: Rental): Observable<Rental> {
        return this.http.put<Rental>(`${this.apiUrl}/${rental.id}`, rental);
    }

    updateRentalStatus(id: number, status: RentalStatus): Observable<RentalResponse> {
        return this.http.put<RentalResponse>(`${this.apiUrl}/${id}/status`, { status });
    }

    // Supprime une location par ID
    deleteRental(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Crée une location à partir d’un produit et de deux dates
    rentProduct(productId: number, startDate: Date, endDate: Date): Observable<Rental> {
        const rental: Partial<Rental> = {
            productId,
            startDate,
            endDate,
            statut: RentalStatus.PENDING, // par défaut à l’envoi
            reservationDate: new Date() // la date actuelle
        };

        return this.http.post<Rental>(this.apiUrl, rental);
    }

    // Récupère les dernières locations (pour dashboard ou page d’accueil)
    getRecentRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/recent`);
    }
}
