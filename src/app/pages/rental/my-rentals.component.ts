import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { RentalService } from '../../services/rental.service';

import { MatTableDataSource } from '@angular/material/table';
import {RentalResponse} from '../../models/rental-response';
import {PageHeaderComponent} from '../../components/page-header/page-header.component';
import {RentalStatus} from '../../models/rental-status';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ReportDialogComponent} from '../report/report-dialog/report-dialog.component';
import {NotificationDialogComponent} from '../../components/notification-dialog/notification-dialog.component';
import {DocumentService} from '../../services/document.service';
import {ViewDocumentsDialogComponent} from '../upload-download/view-documents-dialog/view-documents-dialog.component';

@Component({
    selector: 'app-my-rentals',
    standalone: true,
    templateUrl: './my-rentals.component.html',
    styleUrls: ['./my-rentals.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        PageHeaderComponent,
        MatIconButton,
        NgOptimizedImage
    ]
})
export class MyRentalsComponent implements OnInit {

    // Map statut -> classe de couleur du badge
    // commentaire : on centralise ici l'association statut/couleur pour garder le HTML simple
    statusClassMap: Record<string, string> = {
        PENDING: 'badge-warning',   // orange : en attente
        APPROVED: 'badge-success',  // vert   : validée
        REJECTED: 'badge-danger',   // rouge  : refusée
        CANCELED: 'badge-danger'    // rouge  : annulée (même couleur que refusée)
    };

    displayedColumns: string[] = ['productName', 'period', 'price', 'total', 'quantity', 'status', 'actions'];
    dataSource = new MatTableDataSource<RentalResponse>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private rentalService: RentalService, private dialog: MatDialog, private documentService: DocumentService) {
    }

    ngOnInit(): void {
        // On récupère MES locations (côté API, filtré par l’utilisateur connecté)
        this.rentalService.getClientRentals().subscribe((rentals) => {
            this.dataSource.data = rentals; // ✅ tableau prêt pour MatTable
        });
    }

    ngAfterViewInit(): void {
        // On branche le paginator quand la vue est dispo
        this.dataSource.paginator = this.paginator;
    }

    // label lisible pour le statut venu du back (string)
    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'APPROVED':
                return 'Validée';
            case 'REJECTED':
                return 'Refusée';
            case 'CANCELED':
                return 'Annulée';
            default:
                return status;
        }
    }

    getTotalPrice(rental: RentalResponse): number {
        const start = new Date(rental.startDate);
        const end = new Date(rental.endDate);
        const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return rental.price * rental.quantity * days;
    }

    // Ouvre la modale de signalement
    openReportDialog(rental: any) {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
            width: '400px',
            data: {rentalId: rental.id} // on envoie l'ID de la réservation
        });

        // Optionnel : action après fermeture
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Signalement envoyé avec succès');
            }
        });
    }

    openDocumentsDialog(productId: number) {
        this.dialog.open(ViewDocumentsDialogComponent, {
            width: '700px',
            data: productId
        });
    }
}
