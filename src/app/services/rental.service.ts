import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

import { Rental } from '../models/rental';
import { RentalResponse } from '../models/rental-response';
import {RentalRequest} from '../models/RentalRequest';
import {ApiResponse} from '../models/api-response';
import {RentalStatus} from '../models/rental-status';
import {ApiResponseDto} from '../dto/ApiResponseDto';


// Service injectable partout dans l’app
@Injectable({
    providedIn: 'root'
})
export class RentalService {
    // URL de base pour les appels API liés aux locations
    private apiUrl = 'rentals';

    constructor(private http: HttpClient) {}

    // LECTURE

    /** Liste accessible selon le rôle (CLIENT → ses locations ; TECH/ADMIN → toutes) */
    getAllRentals(): Observable<RentalResponse[]> {
        return this.http
            .get<ApiResponseDto<RentalResponse[]>>(this.apiUrl)
            .pipe(map(res => res.data ?? [])); // on déballe l’enveloppe ici
    }

    /** Mes locations (CLIENT uniquement) */
    getClientRentals(): Observable<RentalResponse[]> {
        return this.http
            .get<ApiResponseDto<RentalResponse[]>>(`${this.apiUrl}/my`)
            .pipe(map(res => res.data ?? []));
    }

    /** Détail d’une location par ID (accès contrôlé côté back) */
    getRentalById(id: number): Observable<Rental> {
        return this.http.get<Rental>(`${this.apiUrl}/${id}`);
    }


    // ÉCRITURE

    /** Créer une location (POST /api/rentals/create) */
    createRental(rental: RentalRequest): Observable<RentalResponse> {
        return this.http
            .post<ApiResponseDto<RentalResponse>>(`${this.apiUrl}/create`, rental)
            .pipe(map(res => res.data as RentalResponse));
    }

    /** Mettre à jour une location existante (PUT /api/rentals/{id}) */
    updateRental(rental: Rental): Observable<RentalResponse> {
        return this.http
            .put<ApiResponseDto<RentalResponse>>(`${this.apiUrl}/${rental.id}`, rental)
            .pipe(map(res => res.data as RentalResponse));
    }

    /** Changer le statut d’une location (PUT /api/rentals/{id}/status) */
    updateRentalStatus(id: number, status: RentalStatus): Observable<RentalResponse> {
        // ⚠️ le back attend une string { status: 'APPROVED' | 'PENDING' | ... }
        return this.http
            .put<ApiResponseDto<RentalResponse>>(`${this.apiUrl}/${id}/status`, { status })
            .pipe(map(res => res.data as RentalResponse));
    }

    /** Supprimer une location (DELETE /api/rentals/{id}) */
    deleteRental(id: number): Observable<void> {
        return this.http
            .delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`)
            .pipe(map(() => void 0)); // pas de data à retourner
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

    /** Dernières locations (Todo endpoint a faire) */
    getRecentRentals(): Observable<RentalResponse[]> {
        return this.http
            .get<ApiResponseDto<RentalResponse[]>>(`${this.apiUrl}/recent`)
            .pipe(map(res => res.data ?? []));
    }
}
