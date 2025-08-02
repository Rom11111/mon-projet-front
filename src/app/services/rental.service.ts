import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental';
import {environment} from '../../environments/environment';
import {RentalResponse} from '../models/rental-response';
 // ajuste le chemin selon ton projet

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private apiUrl = 'rentals';

    constructor(private http: HttpClient) {}

    getAllRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(this.apiUrl);
    }

    getClientRentals(): Observable<RentalResponse[]> {
        return this.http.get<RentalResponse[]>(this.apiUrl);
    }

    getRentalById(id: number): Observable<Rental> {
        return this.http.get<Rental>(`${this.apiUrl}/${id}`);
    }

    createRental(rental: Rental): Observable<Rental> {
        return this.http.post<Rental>(this.apiUrl, rental);
    }

    updateRental(rental: Rental): Observable<Rental> {
        return this.http.put<Rental>(`${this.apiUrl}/${rental.id}`, rental);
    }

    deleteRental(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    rentProduct(productId: number, startDate: Date, endDate: Date): Observable<Rental> {
        const rental: Partial<Rental> = {
            productId,
            startDate,
            endDate,
            statut: 'en attente',
            reservationDate: new Date()
        };

        return this.http.post<Rental>(this.apiUrl, rental);
    }

    getRecentRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/recent`);
    }

}
