
import {inject, OnInit} from '@angular/core';

export class EquipmentsComponent implements OnInit {
    // ...
    rentalService = inject(RentalService);

    openRentalDialog(product: Product) {
        const userId = this.auth.currentUser.id;
        // Ici, il faut que startDate et endDate soient bien définis (par ex via un formulaire ou un dialogue)
        const startDate = this.selectedStartDate; // à récupérer du formulaire
        const endDate = this.selectedEndDate;     // à récupérer du formulaire

        if (!product.id || !userId || !startDate || !endDate) {
            // Affiche une erreur à l'utilisateur
            return;
        }

        this.rentalService.rentProduct(product.id, userId, startDate, endDate)
            .subscribe({
                next: (result) => {
                    // Affiche une confirmation, met à jour l’état, etc.
                },
                error: (err) => {
                    // Affiche une erreur
                }
            });
    }
}
