import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ProductDocument} from '../models/ProductDocument';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    constructor(private http: HttpClient) {}

    /**
     * Upload d’un document lié à un produit
     * @param productId ID du produit concerné
     * @param file Le fichier à envoyer
     * @param type Type de document (ex: USER_GUIDE, TECH_DOC, VIDEO)
     * @param title Titre du document
     */
    uploadDocument(productId: number, file: File, type: string, title: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('title', title);

        return this.http.post(`products/${productId}/documentation/upload`, formData);
    }

    /**
     * Téléchargement ou ouverture d’un document
     * @param productId ID du produit concerné
     * @param docId ID du document à télécharger
     * @param forceDownload true pour forcer le téléchargement, false pour affichage dans le navigateur
     */
    downloadDocument(productId: number, docId: number, forceDownload = false): Observable<Blob> {
        const params = new HttpParams().set('download', forceDownload.toString());

        return this.http.get(`products/${productId}/documentation/${docId}/download`, {
            params,
            responseType: 'blob'
        });
    }

    getDocuments(productId: number): Observable<{ message: string, data: ProductDocument[] }> {
        return this.http.get<{ message: string, data: ProductDocument[] }>(
            `products/${productId}/documentation`
        );
    }

    deleteDocument(docId: number): Observable<any> {
        return this.http.delete(`products/0/documentation/${docId}`); // '0' car pas utilisé côté backend
    }
}
