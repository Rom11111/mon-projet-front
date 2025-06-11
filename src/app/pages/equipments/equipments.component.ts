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
import {MatButton} from '@angular/material/button';
import {AsyncPipe, CurrencyPipe, NgIf, NgStyle} from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

import {RentalService} from '../../services/rental.service';
import {RentalDialogComponent} from '../rental-dialog/rental-dialog.component';
import {ImgSecuredDirective} from '../../components/img-secured/img-secured.directive';
import {ProductService} from '../../services/crud/product.service';
import {environment} from '../../../environments/environment';
import {MatIconModule} from '@angular/material/icon';
import {UserRole} from '../../models/userRole.enum';


@Component({
    selector: 'app-equipments',
    standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        RouterLink,
        NgStyle,
        CurrencyPipe,
        MatDialogModule, // Ajout du module de dialogue
        NgIf,
        ImgSecuredDirective,
        AsyncPipe,
        MatIconModule,

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
    environment = environment;

    products: Product[] = [];

    ngOnInit() {
        this.productService.getAll();
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
                    next: () => alert('Location confirmée !'),
                    error: () => alert('Erreur lors de la location')
                });
            }
        });
    }

    protected readonly UserRole = UserRole;
}

