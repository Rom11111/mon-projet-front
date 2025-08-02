import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { RentalService } from '../../services/rental.service';

import { MatTableDataSource } from '@angular/material/table';
import {RentalResponse} from '../../models/rental-response';
import {PageHeaderComponent} from '../../components/page-header/page-header.component'; // ✅ reste ici uniquement comme classe

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
        PageHeaderComponent
    ]
})
export class MyRentalsComponent implements OnInit {
    displayedColumns: string[] = ['productName', 'period', 'status'];
    dataSource = new MatTableDataSource<RentalResponse>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private rentalService: RentalService) {}

    ngOnInit(): void {
        this.rentalService.getClientRentals().subscribe((rentals) => {
            this.dataSource.data = rentals;
            this.dataSource.paginator = this.paginator;
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'APPROVED': return 'text-success';
            case 'PENDING': return 'text-warning';
            case 'CANCELLED': return 'text-danger';
            default: return '';
        }
    }
}
