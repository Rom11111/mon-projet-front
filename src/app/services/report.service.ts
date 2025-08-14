import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ReportResponse} from '../models/report-response';
import {ApiResponse} from '../models/api-response';


@Injectable({ providedIn: 'root' })
export class ReportService {
    private http = inject(HttpClient);

    // Récupère mes signalements
    getMyReports(): Observable<ReportResponse[]> {
        return this.http.get<{ message: string; data: ReportResponse[] }>('reports/my-reports')
            .pipe(
                map(response => response.data)
            );
    }

    getAllReports(): Observable<ApiResponse<ReportResponse[]>> {
        return this.http.get<ApiResponse<ReportResponse[]>>('reports');
    }

    /** Met à jour le statut d’un signalement */
    updateReportStatus(
        reportId: number,
        status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
    ): Observable<ApiResponse<ReportResponse>> {
        // On envoie le statut en query param comme dans Postman
        const params = new HttpParams().set('status', status);

        // PATCH avec corps vide (null) et params
        return this.http.patch<ApiResponse<ReportResponse>>(
            `reports/${reportId}/status`,
            null,
            { params }
        );
    }
}
