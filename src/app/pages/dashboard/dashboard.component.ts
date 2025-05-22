import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCard} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {DashboardService} from '../../services/dashboard.service';
import {RentalService} from '../../services/rental.service';
import {
    trigger,
    style,
    transition,
    animate,
    query,
    stagger
} from '@angular/animations';

interface Rental {
    client: string;
    equipment: string;
    start: Date | string;
    end: Date | string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCard,
        MatIcon,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
    ],
    animations: [
        trigger('fadeSlideIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('staggerCards', [
            transition(':enter', [
                query('.stat-card', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger(100, [
                        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ])
            ])
        ])
    ]
})




export class DashboardComponent implements OnInit, AfterViewInit {

    activeRentals = 0;
    availableEquipments = 0;
    lateReturns = 0;
    inRepair = 0;
    monthlyRevenue = 0;

    recentRentals: Rental[] = [];
    dataSource: MatTableDataSource<Rental> = new MatTableDataSource<Rental>([]);

    displayedColumns: string[] = ['client', 'equipment', 'start', 'end'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dashboardService: DashboardService,
        private rentalService: RentalService
    ) {}

    ngOnInit(): void {
        // Récupérer les stats du dashboard
        this.dashboardService.getStats().subscribe(stats => {
            this.activeRentals = stats.activeRentals;
            this.availableEquipments = stats.availableEquipments;
            this.lateReturns = stats.lateReturns;
            this.inRepair = stats.inRepair;
            this.monthlyRevenue = stats.monthlyRevenue;
        });

        // Récupérer les dernières locations
        this.rentalService.getRecentRentals().subscribe(rentals => {
            this.recentRentals = rentals;
            this.dataSource.data = this.recentRentals;
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
    }
}
