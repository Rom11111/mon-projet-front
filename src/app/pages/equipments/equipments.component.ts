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
import {CurrencyPipe, NgStyle} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
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
        MatDialog, // Ajout du module de dialogue
        RentalDialogComponent // Ajout du composant de dialogue standalone
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
                const userId = this.auth.currentUser.id;
                this.rentalService.rentProduct(product.id, userId, result.startDate, result.endDate)
                    .subscribe({
                        next: () => {
                            // Affiche une confirmation ou mets à jour l'état
                            // Par exemple : this.refreshProducts();
                        },
                        error: () => {
                            // Affiche une erreur
                        }
                    });
            }
        });
    }
}

