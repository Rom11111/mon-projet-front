import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';

import {MatButton} from '@angular/material/button';
import {Client} from '../../models/client';


@Component({
  selector: 'app-client-details-dialog',
    imports: [
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatDialogClose
    ],
  templateUrl: './client-details-dialog.component.html',
  styleUrl: './client-details-dialog.component.scss'
})
export class ClientDetailsDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Client) {}
}




