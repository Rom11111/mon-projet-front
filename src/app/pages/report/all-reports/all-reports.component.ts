import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ReportService } from '../../../services/report.service';
import { ReportResponse } from '../../../models/report-response';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {ChangeReportStatusComponent} from '../change-report-status/change-report-status.component';
import {ReportDetailsDialogComponent} from '../report-details-dialog/report-details-dialog.component';


@Component({
    standalone: true,
    selector: 'app-all-reports',
    templateUrl: './all-reports.component.html',
    styleUrls: ['./all-reports.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatSnackBarModule,
        PageHeaderComponent,
        MatDialogModule
    ]
})


export class AllReportsComponent implements OnInit {
    // Ajout de la colonne "actions"
    displayedColumns: string[] = [
        'id',
        'productName',
        'description',
        'status',
        'createdAt',
        'actions'
    ];
    dataSource = new MatTableDataSource<ReportResponse>();

    // Stock des IDs en cours d’update pour désactiver le bouton
    updatingIds = new Set<number>();

    currentReport?: ReportResponse;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private reportService: ReportService,
        private snack: MatSnackBar,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadReports();
    }

    loadReports(): void {
        this.reportService.getAllReports().subscribe(res => {
            this.dataSource.data = res.data;
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'OPEN': return 'Ouvert';
            case 'IN_PROGRESS': return 'En cours';
            case 'RESOLVED': return 'Résolu';
            default: return status;
        }
    }

    isUpdating(id: number): boolean {
        return this.updatingIds.has(id);
    }

    openStatusDialog(report: ReportResponse) {
        const dialogRef = this.dialog.open(ChangeReportStatusComponent, {
            width: '400px',
            data: { report }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.changeStatus(report, result);
            }
        });
    }

    openDetailsDialog(report: ReportResponse): void {
        this.dialog.open(ReportDetailsDialogComponent, {
            width: '500px',
            data: { report }
        });
    }

    changeStatus(report: ReportResponse, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') {
        if (report.status === status) return;

        this.updatingIds.add(report.id);

        this.reportService.updateReportStatus(report.id, status).subscribe({
            next: (res) => {
                // On met à jour la ligne dans la table
                const idx = this.dataSource.data.findIndex(r => r.id === report.id);
                if (idx > -1) {
                    const updated = [...this.dataSource.data];
                    updated[idx] = res.data;
                    this.dataSource.data = updated;
                }
                this.snack.open(res.message, 'OK', { duration: 2000 });
            },
            error: () => {
                this.snack.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
            },
            complete: () => {
                this.updatingIds.delete(report.id);
            }
        });
    }
}
