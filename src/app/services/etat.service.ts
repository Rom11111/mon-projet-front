import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etat } from '../models/etat';

@Injectable({
    providedIn: 'root'
})
export class EtatService {

    private http = inject(HttpClient);
    private baseUrl = '/etats'; // ✅ correspond à ton @GetMapping("/etats")

    /** Récupère la liste de tous les états */
    getEtats(): Observable<Etat[]> {
        return this.http.get<Etat[]>(this.baseUrl);
    }

    /** Récupère un état par son id */
    getEtatById(id: number): Observable<Etat> {
        return this.http.get<Etat>(`${this.baseUrl}/${id}`);
    }

    /** Ajoute un nouvel état */
    addEtat(etat: Etat): Observable<Etat> {
        return this.http.post<Etat>(this.baseUrl.replace('/etats', '/etat'), etat);
    }

    /** Met à jour un état existant */
    updateEtat(id: number, etat: Etat): Observable<void> {
        return this.http.put<void>(`${this.baseUrl.replace('/etats', '/etat')}/${id}`, etat);
    }

    /** Supprime un état */
    deleteEtat(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl.replace('/etats', '/etat')}/${id}`);
    }
}

