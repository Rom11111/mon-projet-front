import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RentalResponse } from '../../models/rental-response';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-rental-form',
    standalone: true,
    templateUrl: './rental-form.component.html',
    styleUrls: ['./rental-form.component.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
    ]
})
export class RentalFormComponent {
    form: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: RentalResponse,
        private dialogRef: MatDialogRef<RentalFormComponent>,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            status: [data.status] // Initialisé avec la valeur actuelle
        });
    }


    onSubmit(): void {
        if (this.form.valid) {
            const newStatus = this.form.value.status;
            this.dialogRef.close(newStatus); // Renvoie la nouvelle valeur
        }
    }

    close(): void {
        this.dialogRef.close(); // Ferme sans changement
    }
}

