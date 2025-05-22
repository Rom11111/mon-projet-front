import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface DashboardStats {
    activeRentals: number;
    availableEquipments: number;
    lateReturns: number;
    inRepair: number;
    monthlyRevenue: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiUrl = environment.serverUrl + 'api/dashboard'; // URL de base

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }

}
