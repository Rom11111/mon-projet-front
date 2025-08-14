import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReportResponse } from '../../../models/report-response';

@Component({
    standalone: true,
    selector: 'app-change-report-status',
    templateUrl: './change-report-status.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule
    ]
})
export class ChangeReportStatusComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ChangeReportStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { report: ReportResponse }
    ) {
        this.form = this.fb.group({
            status: [data.report.status] // pré-remplir avec le statut actuel
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value.status); // renvoie le nouveau statut
        }
    }
}

