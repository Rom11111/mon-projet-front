import {Component, inject, OnInit} from '@angular/core';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ProductService} from '../../services/crud/product.service';
import {MatButton} from '@angular/material/button';
import {CurrencyPipe, NgIf, NgStyle} from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

import {RentalService} from '../../services/rental.service';
import {RentalDialogComponent} from '../rental-dialog/rental-dialog.component';


@Component({
    selector: 'app-equipments',
    standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardImage,
        MatCardSubtitle,
        MatCardTitle,
        RouterLink,
        NgStyle,
        CurrencyPipe,
        MatDialogModule, // Ajout du module de dialogue
        RentalDialogComponent,
        NgIf,
        // Ajout du composant de dialogue standalone
    ],
    templateUrl: './equipments.component.html',
    styleUrl: './equipments.component.scss'
})
export class EquipmentsComponent implements OnInit {
    auth = inject(AuthService);
    productService = inject(ProductService);
    rentalService = inject(RentalService);
    dialog = inject(MatDialog);

    products: Product[] = [];

    ngOnInit() {
        this.productService.getAll();
        this.productService.products$.subscribe(
            products => this.products = products
        );
    }

    openRentalDialog(product: Product) {
        const dialogRef = this.dialog.open(RentalDialogComponent, {
            data: { product }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Conversion de l'ID en number et ajout de la conversion de date
                this.rentalService.rentProduct(
                    Number(product.id),
                    new Date(result.startDate),
                    new Date(result.endDate)
                ).subscribe({
                    next: () => {
                        // Affiche une confirmation
                        alert('Location confirmée !');
                    },
                    error: () => {
                        alert('Erreur lors de la location');
                    }
                });
            }
        });
    }
}

