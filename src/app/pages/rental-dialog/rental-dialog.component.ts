import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

@Component({
    selector: 'app-rental-dialog',
    templateUrl: './rental-dialog.component.html',
    imports: [
        MatFormField,
        MatDatepicker,
        MatDatepickerToggle,
        MatDatepickerInput,
        ReactiveFormsModule,
        MatDialogTitle,
        MatDialogActions,
        MatLabel
    ],
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
