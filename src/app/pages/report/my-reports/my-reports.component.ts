import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import {ReportService} from '../../../services/report.service';
import {ReportResponse} from '../../../models/report-response';
import {PageHeaderComponent} from '../../../components/page-header/page-header.component';

@Component({
    standalone: true,
    selector: 'app-my-reports',
    templateUrl: './my-reports.component.html',
    styleUrls: ['./my-reports.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        PageHeaderComponent
    ]
})
export class MyReportsComponent implements OnInit {
    displayedColumns: string[] = ['id', 'productName', 'description', 'status', 'createdAt'];
    dataSource = new MatTableDataSource<ReportResponse>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private reportService: ReportService) {}

    ngOnInit(): void {
        this.reportService.getMyReports().subscribe((reports: ReportResponse[]) => {
            this.dataSource.data = reports;
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
}
