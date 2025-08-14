import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { NotificationService } from '../notification.service';
import { environment } from '../../../environments/environment';
import {ApiResponseDto} from '../../dto/ApiResponseDto';
import {Product} from '../../models/product';
import {AuthService} from '../auth.service';

@Injectable({
    providedIn: 'root' // rend le service disponible partout sans le déclarer dans un module
})
export class ProductService {

    // Injection du HttpClient d'Angular pour faire des appels HTTP
    private http = inject(HttpClient);

    // Service de notification personnalisé (ex: pour afficher des messages de succès/erreur)
    private notification = inject(NotificationService);

    private auth = inject(AuthService);

    // Observable qui contient la liste des produits, accessible dans toute l'application
    readonly products$ = new BehaviorSubject<Product[]>([]);

    /**
     * Méthode générique : appelle automatiquement la bonne version selon le rôle
     */
    getAll() {
        if (this.auth.role === 'ROLE_ADMIN' || this.auth.role === 'ROLE_TECH') {
            this.getAllAdmin();
        } else {
            this.getAllClient();
        }
    }

    /** Produits pour un client (moins d'infos) */
    getAllClient() {
        this.http.get<Product[]>('products')
            .subscribe(products => this.products$.next(products));
    }

    /** Produits pour un admin/tech (toutes les infos, y compris stock) */
    getAllAdmin() {
        this.http.get<Product[]>('admin/products')
            .subscribe(products => this.products$.next(products));
    }

    /**
     * Enregistre un nouveau produit via l'API
     * @param product - l'objet produit à enregistrer
     * Renvoie un Observable (exploitable avec .subscribe() si besoin)
     */
    save(product: any) {
        return this.http.post( 'product', product).pipe(
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
        // ⚠️ ce PUT doit retourner le Product complet (avec imageName)
        return this.http.put<Product>('product/' + id, product).pipe(
            // Après succès, on remplace l’élément dans le BehaviorSubject (pas besoin de recharger toute la liste)
            // et on laisse le composant reconstruire imageUrl avec le nouvel imageName
            tap((updatedProduct) => {
                const current = this.products$.value;
                const index = current.findIndex(p => p.id === id);
                if (index !== -1) {
                    current[index] = updatedProduct;
                    this.products$.next([...current]); // emet une nouvelle liste => le subscribe du composant refabrique imageUrl
                } else {
                    // Si le produit n'est pas dans la liste (cas rare), on peut l'ajouter
                    this.products$.next([...current, updatedProduct]);
                }
            })
        );
    }


    /**
     * Active ou désactive un produit (toggle disponibilité)
     * Appelle l’endpoint PATCH /admin/product/{id}/toggle-availability
     * @param productId - ID du produit à modifier
     */
    toggleAvailability(productId: number): Observable<ApiResponseDto<Product>> {
        return this.http.patch<ApiResponseDto<Product>>(
            `admin/product/${productId}/toggle-availability`,
            {}
        ).pipe(
            tap(res => {
                const dispo = res.data.available ? 'disponible' : 'indisponible';
                this.notification.success(`Produit ${res.data.name} est maintenant ${dispo}`);
                // Optionnel : this.getAll(); si tu veux actualiser la liste
            })
        );
    }



    /**
     * Supprime un produit par son ID
     * @param id - identifiant du produit à supprimer
     * Met à jour automatiquement la liste après suppression
     */
    delete(id: number) {
        return this.http.delete( 'product/' + id).pipe(
            tap(() => {
                this.notification.success('Produit supprimé avec succès');
                this.getAll(); // met à jour la liste après suppression
            })
        );
    }
}
