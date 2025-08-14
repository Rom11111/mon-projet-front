import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {RentalService} from '../../../services/rental.service';
import {
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDatepickerToggle
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {RentalRequest} from '../../../models/RentalRequest';
import {toLocalDateString} from '../../../utils/date-utils';

@Component({
    standalone: true,
    selector: 'app-rental-dialog',
    templateUrl: './rental-dialog.component.html',
    styleUrls: ['./rental-dialog.component.scss'],
    imports: [
        CommonModule,               // ngIf, ngFor...
        ReactiveFormsModule,        // Formulaires réactifs
        MatFormFieldModule,         // <mat-form-field>
        MatInputModule,             // <input matInput>
        MatDialogModule,            // Pour la modale
        MatButtonModule,
        MatDatepickerToggle,
        MatDatepickerInput,
        MatDatepicker,
        // <button mat-button>
    ]
})
export class RentalDialogComponent {
    // Formulaire pour la location
    rentalForm: FormGroup;
    today: Date = new Date();

    constructor(
        private fb: FormBuilder,
        private rentalService: RentalService,
        private dialogRef: MatDialogRef<RentalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { product: any }
    ) {
        // Initialisation du formulaire avec 3 champs
        this.rentalForm = this.fb.group({
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]]
        });
    }

    getTotalPrice(): number {
        const { startDate, endDate, quantity } = this.rentalForm.value;

        if (!startDate || !endDate || endDate < startDate || quantity < 1) return 0;

        // On calcule la durée en jours (inclusifs)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end.getTime() - start.getTime();
        const dayCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

        const unitPrice = this.data.product.price;
        return dayCount * quantity * unitPrice;
    }

    confirm(): void {
        if (this.rentalForm.invalid) return;

        const formData = this.rentalForm.value;

        const rental: RentalRequest = {
            productId: this.data.product.id,
            startDate: toLocalDateString(new Date(formData.startDate)),
            endDate: toLocalDateString(new Date(formData.endDate)),
            quantity: formData.quantity
        };
        console.log('Start:', rental.startDate, 'End:', rental.endDate);
        this.rentalService.createRental(rental).subscribe(() => {
            this.dialogRef.close(true);
        });
    }


    // Annule la modale
    cancel(): void {
        this.dialogRef.close(false);
    }
}
