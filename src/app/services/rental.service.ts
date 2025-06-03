import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Rental } from '../models/rental';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = environment.serverUrl + 'api/rentals';

  constructor(private http: HttpClient) { }

  /**
   * Récupère les locations récentes
   */
  getRecentRentals(): Observable<Rental[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`)
      .pipe(
        map(rentals => rentals.map(rental => this.transformRentalFromBackend(rental)))
      );
  }

  /**
   * Récupère une location par ID
   */
  getRentalById(id: number): Observable<Rental> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(rental => this.transformRentalFromBackend(rental))
      );
  }

  /**
   * Crée une nouvelle location
   */
  createRental(rental: Rental): Observable<Rental> {
    const backendRental = this.transformRentalToBackend(rental);
    return this.http.post<any>(this.apiUrl, backendRental)
      .pipe(
        map(rental => this.transformRentalFromBackend(rental))
      );
  }

  /**
   * Met à jour une location existante
   */
  updateRental(id: number, rental: Rental): Observable<Rental> {
    const backendRental = this.transformRentalToBackend(rental);
    return this.http.put<any>(`${this.apiUrl}/${id}`, backendRental)
      .pipe(
        map(rental => this.transformRentalFromBackend(rental))
      );
  }

  /**
   * Supprime une location
   */
  deleteRental(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Loue un produit avec des dates de début et fin
   */
  rentProduct(productId: number, startDate: Date, endDate: Date): Observable<Rental> {
    const body = {
      productId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    return this.http.post<any>(`${this.apiUrl}/rent`, body)
      .pipe(
        map(rental => this.transformRentalFromBackend(rental))
      );
  }

  /**
   * Transforme une location reçue du backend vers le format frontend
   */
  private transformRentalFromBackend(backendRental: any): Rental | null {
    if (!backendRental) return null;

    // Vérification des propriétés obligatoires
    if (!backendRental.id || !backendRental.date) {
      console.error('Données de location incomplètes:', backendRental);
      return null;
    }

    // Déterminer le statut basé sur confirmed et expirationDate
    let statut: 'confirmé' | 'en attente' | 'annulé' = 'en attente';

    if (backendRental.confirmed) {
      statut = 'confirmé';
    } else if (backendRental.expirationDate && new Date(backendRental.expirationDate) < new Date()) {
      statut = 'annulé';
    }

    // Extraire les heures de début et de fin en s'assurant que les dates sont valides
    let heureDebut: string | undefined = undefined;
    let heureFin: string | undefined = undefined;

    try {
      if (backendRental.reservationDate) {
        const reservationDate = new Date(backendRental.reservationDate);
        if (!isNaN(reservationDate.getTime())) {
          heureDebut = reservationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
      }

      if (backendRental.expirationDate) {
        const expirationDate = new Date(backendRental.expirationDate);
        if (!isNaN(expirationDate.getTime())) {
          heureFin = expirationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
      }
    } catch (e) {
      console.error('Erreur lors du formatage des dates:', e);
    }

    // S'assurer que la date est valide
    let date: Date;
    try {
      date = new Date(backendRental.date);
      if (isNaN(date.getTime())) {
        throw new Error('Date invalide');
      }
    } catch (e) {
      console.error('Date de location invalide:', backendRental.date);
      date = new Date(); // Utiliser la date actuelle comme fallback
    }

    return {
      id: backendRental.id,
      clientId: backendRental.user?.id,
      productId: backendRental.product?.id,
      date,
      heureDebut,
      heureFin,
      statut,
      reservationDate: backendRental.reservationDate ? new Date(backendRental.reservationDate) : undefined,
      expirationDate: backendRental.expirationDate ? new Date(backendRental.expirationDate) : undefined,
      confirmed: backendRental.confirmed,
      isActive: backendRental.active
    };
  }

  /**
   * Transforme une location du format frontend vers le format backend
   */
  private transformRentalToBackend(rental: Rental): any {
    // Convertir le statut en boolean confirmed
    const confirmed = rental.statut === 'confirmé';

    // Créer ou calculer reservationDate et expirationDate si nécessaire
    let reservationDate = rental.reservationDate;
    let expirationDate = rental.expirationDate;

    if (!reservationDate && rental.date && rental.heureDebut) {
      const dateObj = new Date(rental.date);
      const [hours, minutes] = rental.heureDebut.split(':').map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
      reservationDate = dateObj;
    }

    if (!expirationDate && rental.date && rental.heureFin) {
      const dateObj = new Date(rental.date);
      const [hours, minutes] = rental.heureFin.split(':').map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
      expirationDate = dateObj;
    }

    return {
      id: rental.id,
      user: { id: rental.clientId },
      product: { id: rental.productId },
      date: rental.date,
      reservationDate,
      expirationDate,
      confirmed
    };
  }
}
