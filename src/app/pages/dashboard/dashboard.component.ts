import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from '../../services/dashboard.service';
import { RentalService } from '../../services/rental.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    trigger,
    style,
    transition,
    animate,
    query,
    stagger
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';

export interface Rental {
    id: number;
    clientId: number;
    productId: number;
    date: Date;
    heureDebut?: string;
    heureFin?: string;
    statut: 'confirmé' | 'en attente' | 'annulé';
    reservationDate?: Date;
    expirationDate?: Date;
    confirmed?: boolean;
    isActive?: boolean;
    user?: { firstname: string; lastname: string };
    product?: { name: string };
    startDate?: Date;
    endDate?: Date;
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
        MatSnackBarModule
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
                ], { optional: true })
            ])
        ])
    ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    firstName: string = 'Utilisateur';

    activeRentals = 0;
    availableEquipments = 0;
    lateReturns = 0;
    inRepair = 0;
    monthlyRevenue = 0;

    recentRentals: Rental[] = [];
    dataSource: MatTableDataSource<Rental> = new MatTableDataSource<Rental>([]);
    displayedColumns: string[] = ['client', 'equipment', 'start', 'end'];

    isLoading = true;
    private destroy$ = new Subject<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dashboardService: DashboardService,
        private rentalService: RentalService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        public auth: AuthService
    ) {}

    ngOnInit(): void {
        // Récupération du prénom
        this.userService.getCurrentUser().subscribe({
            next: user => this.firstName = user.firstname || 'Utilisateur',
            error: () => this.firstName = 'Utilisateur'
        });

        // Stats
        this.dashboardService.getStats()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: stats => {
                    this.activeRentals = stats.activeRentals;
                    this.availableEquipments = stats.availableEquipments;
                    this.lateReturns = stats.lateReturns;
                    this.inRepair = stats.inRepair;
                    this.monthlyRevenue = stats.monthlyRevenue;
                },
                error: error => {
                    console.error('Erreur stats', error);
                    this.snackBar.open('Erreur lors du chargement des statistiques', 'Fermer', {
                        duration: 5000
                    });
                }
            });

        // Dernières locations
        this.rentalService.getRecentRentals()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: rentals => {
                    this.recentRentals = rentals;
                    this.dataSource.data = this.formatRentalsForTable(rentals);
                    this.isLoading = false;
                },
                error: error => {
                    console.error('Erreur locations', error);
                    this.snackBar.open('Erreur lors du chargement des locations récentes', 'Fermer', {
                        duration: 5000
                    });
                    this.isLoading = false;
                }
            });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private formatRentalsForTable(rentals: Rental[]): any[] {
        return rentals.map(rental => ({
            client: rental.user?.firstname + ' ' + rental.user?.lastname || 'Client inconnu',
            equipment: rental.product?.name || 'Équipement inconnu',
            start: rental.startDate || rental.date,
            end: rental.endDate || '-'
        }));
    }

    applyFilter(event: Event): void {
        this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
