import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import {NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-notification-dialog',
    templateUrl: './notification-dialog.component.html',
    imports: [
        NgClass,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose
    ],
    styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { title?: string; message: string; type?: 'valid' | 'error' | 'info' | 'warning' }
    ) {}
}
