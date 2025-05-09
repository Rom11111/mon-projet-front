import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-rental-dialog',
    templateUrl: './rental-dialog.component.html',
    styleUrl: './rental-dialog.component.scss'


})

export class RentalDialogComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<RentalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            startDate: [null, Validators.required],
            endDate: [null, Validators.required]
        });
    }

    submit() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
