import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RentalService {
    constructor(private http: HttpClient) {}

    rentProduct(productId: Number, startDate: Date, endDate: Date): Observable<any> {
        // Adapte l’URL selon ton backend
        return this.http.post('/api/rentals', {
            id: productId,
            startDate,
            endDate
        });
    }
}
