import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { NotificationService } from '../notification.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root' // rend le service disponible partout sans le déclarer dans un module
})
export class ProductService {

    // Injection du HttpClient d'Angular pour faire des appels HTTP
    private http = inject(HttpClient);

    // Service de notification personnalisé (ex: pour afficher des messages de succès/erreur)
    private notification = inject(NotificationService);

    // Observable qui contient la liste des produits, accessible dans toute l'application
    readonly products$ = new BehaviorSubject<Product[]>([]);

    /**
     * Récupère tous les produits depuis l'API
     * Met à jour la liste des produits dans le BehaviorSubject
     */
    getAll() {
        this.http.get<Product[]>(environment.serverUrl + 'products')
            .subscribe(products => this.products$.next(products));
    }

    /**
     * Enregistre un nouveau produit via l'API
     * @param product - l'objet produit à enregistrer
     * Renvoie un Observable (exploitable avec .subscribe() si besoin)
     */
    save(product: any) {
        return this.http.post(environment.serverUrl + 'product', product).pipe(
            // une fois le produit enregistré, on met à jour la liste
            tap(() => this.getAll())
            // pas de catchError ici : il est géré par l'intercepteur global
        );
    }

    /**
     * Met à jour un produit existant via l'API
     * @param id - identifiant du produit à mettre à jour
     * @param product - les nouvelles données à enregistrer
     * Renvoie un Observable
     */
    update(id: number, product: any) {
        return this.http.put(environment.serverUrl + 'product/' + id, product).pipe(
            // met à jour la liste après modification
            tap(() => this.getAll())
        );
    }
}
