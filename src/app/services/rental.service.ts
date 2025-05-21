import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rental {
    client: string;
    equipment: string;
    start: Date | string;
    end: Date | string;
    // ajoute d'autres champs si besoin
}

@Injectable({
    providedIn: 'root'
})
export class RentalService {

    private apiUrl = 'http://localhost:8080/api/rentals/recent\n' +
        '\n'; // adapte à ton URL

    constructor(private http: HttpClient) { }

    getRecentRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/recent`);
    }

    getRentalById(id: number): Observable<Rental> {
        return this.http.get<Rental>(`${this.apiUrl}/${id}`);
    }

    createRental(rental: Rental): Observable<Rental> {
        return this.http.post<Rental>(this.apiUrl, rental);
    }

    updateRental(id: number, rental: Rental): Observable<Rental> {
        return this.http.put<Rental>(`${this.apiUrl}/${id}`, rental);
    }

    deleteRental(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    rentProduct(productId: number, startDate: Date, endDate: Date): Observable<any> {
        const body = {
            productId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
        return this.http.post(`${this.apiUrl}/rent`, body);
    }

}
