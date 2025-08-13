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
import {PageHeaderComponent} from '../../components/page-header/page-header.component';
import {RentalResponse} from '../../models/rental-response';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCard,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSnackBarModule,
        PageHeaderComponent
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

    recentRentals: RentalResponse[] = [];

    dataSource = new MatTableDataSource<{
        client: string;
        equipment: string;
        start: string;
        end: string;
    }>();
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
                }
            });

        // Dernières locations
        this.rentalService.getRecentRentals()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (rentals) => {
                    // On garde la data brute si on veut afficher des détails ailleurs
                    this.recentRentals = rentals;

                    // On forme les lignes pour la table (client / produit / dates)
                    this.dataSource.data = this.formatRentalsForTable(rentals);
                },
                complete: () => this.isLoading = false
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

    private formatRentalsForTable(
        rentals: RentalResponse[]
    ): { client: string; equipment: string; start: string; end: string }[] {
        // commentaire : on forme des lignes prêtes pour l'affichage du tableau
        return rentals.map(r => ({
            // d'abord les champs à plat, sinon fallback sur l'objet user si présent
            client:
                `${r.clientFirstname ?? ''} ${r.clientLastname ?? ''}`.trim()
                || `${r.user?.firstname ?? ''} ${r.user?.lastname ?? ''}`.trim()
                || 'Client inconnu',

            // d'abord le nom à plat, sinon fallback sur product?.name
            equipment: r.productName ?? r.product?.name ?? 'Équipement inconnu',

            // dates en string ISO (le date pipe se charge du format)
            start: r.startDate ?? r.reservationDate,
            end: r.endDate || '-',
        }));
    }

    applyFilter(event: Event): void {
        this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
