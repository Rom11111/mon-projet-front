import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {ReportResponse} from '../../../models/report-response';


@Component({
    standalone: true,
    selector: 'app-report-details-dialog',
    templateUrl: './report-details-dialog.component.html',
    styleUrls: ['./report-details-dialog.component.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class ReportDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ReportDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { report: ReportResponse }
    ) {}

    close(): void {
        this.dialogRef.close();
    }
}

