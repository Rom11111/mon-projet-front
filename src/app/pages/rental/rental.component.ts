import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { SelectionModel } from '@angular/cdk/collections';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { RentalFormComponent } from './rental-form.component';

import { RentalResponse } from '../../models/rental-response';
import { RentalStatus } from '../../models/rental-status';
import { RentalService } from '../../services/rental.service';

// ✅ importe le service d'export
import { ExportService } from '../../shared/export.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-rental',
    standalone: true,
    templateUrl: './rental.component.html',
    styleUrls: ['./rental.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        PageHeaderComponent,
        MatCard,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        RentalFormComponent,
        NgOptimizedImage,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
})
export class RentalComponent implements OnInit {
    displayedColumns: string[] = [
        'select', 'id', 'clientName', 'productName', 'quantity',
        'startDate', 'endDate', 'status', 'reservationDate', 'actions'
    ];

    // la table manipule des RentalResponse
    dataSource = new MatTableDataSource<RentalResponse>();

    // garde une seule sélection, typée comme la table
    selection = new SelectionModel<RentalResponse>(true, []);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private rentalService: RentalService,
        private dialog: MatDialog,
        private exportService: ExportService
    ) {}

    ngOnInit(): void {
        this.rentalService.getAllRentals().subscribe((res) => {
            console.log('Réponse du backend :', res);
            this.dataSource.data = res.data as RentalResponse[];
        });

        // commentaire : attache paginator/sort après init
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // label lisible pour le statut venu du back (string)
    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING':  return 'En attente';
            case 'APPROVED': return 'Validée';
            case 'REJECTED': return 'Refusée';
            case 'CANCELED': return 'Annulée';
            default:         return status;
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: RentalResponse): string {
        if (!row) {
            return this.isAllSelected() ? 'Désélectionner tout' : 'Tout sélectionner';
        }
        return this.selection.isSelected(row)
            ? `Désélectionner la réservation ${row.id}`
            : `Sélectionner la réservation ${row.id}`;
    }

    openStatusDialog(rental: RentalResponse): void {
        const dialogRef = this.dialog.open(RentalFormComponent, {
            width: '400px',
            data: rental
        });

        dialogRef.afterClosed().subscribe((newStatus: RentalStatus | undefined) => {
            if (newStatus && newStatus !== rental.status) {
                this.rentalService.updateRentalStatus(rental.id, newStatus).subscribe({
                    next: () => this.ngOnInit(), // commentaire : refresh simple
                    error: () => console.error('Erreur lors de la mise à jour du statut.')
                });
            }
        });
    }

    // ----- Utilitaires d'export -----

    // format JJ/MM/AAAA, accepte Date ou string ISO
    private fmtDate(d?: string | Date): string {
        if (!d) return '';
        const date = (d instanceof Date) ? d : new Date(d);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR');
    }

    // commentaire : jours entre deux dates (arrondi haut)
    private daysBetween(a?: string | Date, b?: string | Date): number | '' {
        if (!a || !b) return '';
        const d1 = (a instanceof Date) ? a : new Date(a);
        const d2 = (b instanceof Date) ? b : new Date(b);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '';
        return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    // commentaire : renvoie sélection si présente, sinon toutes les lignes
    private getRowsForExport(): RentalResponse[] {
        return this.selection.selected.length ? this.selection.selected : this.dataSource.data;
    }

    // Concatène prénom + nom
    private getClientName(r: RentalResponse): string {
        return `${(r as any).clientFirstname ?? ''} ${(r as any).clientLastname ?? ''}`.trim();
    }

    // ----- Export principal (CSV / XLSX / PDF) -----
    async export(format: 'csv' | 'xlsx' | 'pdf') {
        const rows = this.getRowsForExport();

        // commentaire : mapping propre pour le RH (depuis RentalResponse)
        const mapped = rows.map(r => ({
            'ID': r.id,
            'Client': this.getClientName(r),          // vient de RentalResponse
            'Produit': r.productName ?? '',
            'Début': this.fmtDate(r.startDate),
            'Fin': this.fmtDate(r.endDate),
            'Période (jours)': this.daysBetween(r.startDate, r.endDate),
            'Qté': r.quantity ?? '',
            'Statut': this.getStatusLabel(String(r.status)), // status -> libellé
            'Réservée le': this.fmtDate(r.reservationDate),
            // ajoute d'autres champs utiles au RH si présents dans RentalResponse
        }));

        if (format === 'csv') {
            this.exportService.exportCSV(mapped, 'reservations');
        } else if (format === 'xlsx') {
            await this.exportService.exportXLSX(mapped, 'reservations');
        } else {
            await this.exportService.exportPDF(mapped, 'reservations');
        }
    }
}
