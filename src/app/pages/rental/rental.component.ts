import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Rental} from '../../models/rental';
import {RentalService} from '../../services/rental.service';



@Component({
    selector: 'app-rental',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule
    ],
    templateUrl: './rental.component.html',
    styleUrls: ['./rental.component.scss']
})
export class RentalComponent implements OnInit {
    rentals: Rental[] = [];
    dataSource!: MatTableDataSource<Rental>;
    displayedColumns: string[] = ['client', 'product', 'date', 'time', 'statut'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private rentalService: RentalService) {}

    ngOnInit() {
        this.rentalService.getAllRentals().subscribe((data: Rental[]) => {
            this.rentals = data;
            this.dataSource = new MatTableDataSource(this.rentals);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getStatutClass(statut: string): string {
        switch (statut) {
            case 'confirmé':
                return 'badge badge-success';
            case 'en attente':
                return 'badge badge-warning';
            case 'annulé':
                return 'badge badge-danger';
            default:
                return '';
        }
    }
}
