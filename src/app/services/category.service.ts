import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    // ✅ endpoint (garde 'categories' si ton interceptor ajoute le host automatiquement)
    private baseUrl = 'categories';

    // ✅ cache du dernier résultat (réutilisé par tous les abonnés)
    private categories$?: Observable<Category[]>;

    constructor(private http: HttpClient) {}

    // 🔹 Récupère les catégories et met en cache (1 seule requête HTTP)
    getCategories(): Observable<Category[]> {
        if (!this.categories$) {
            this.categories$ = this.http.get<Category[]>(this.baseUrl).pipe(
                // shareReplay(1) = mémorise la dernière valeur pour les prochains abonnés
                shareReplay(1)
            );
        }
        return this.categories$;
    }

    // 🔹 Renvoie une Map id -> nom (pratique pour afficher rapidement le libellé)
    getCategoryMap(): Observable<Map<number, string>> {
        return this.getCategories().pipe(
            map(cats => new Map<number, string>(cats.map(c => [c.id, c.name])))
        );
    }
}
