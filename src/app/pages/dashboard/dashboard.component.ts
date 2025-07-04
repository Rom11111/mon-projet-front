import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from '../../services/dashboard.service';
import { RentalService } from '../../services/rental.service';
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
import {AuthService} from '../../services/auth.service';

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
    // Ajouter ces propriétés manquantes
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
                ], { optional: true }) // Ajout de optional pour éviter les erreurs si aucun élément ne correspond
            ])
        ])
    ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    // Nom de l'utilisateur pour le message de bienvenue
    userName: string = '';

    // Stats du dashboard
    activeRentals = 0;
    availableEquipments = 0;
    lateReturns = 0;
    inRepair = 0;
    monthlyRevenue = 0;

    // Données pour le tableau
    recentRentals: Rental[] = [];
    dataSource: MatTableDataSource<Rental> = new MatTableDataSource<Rental>([]);
    displayedColumns: string[] = ['client', 'equipment', 'start', 'end'];

    // État du chargement
    isLoading = true;

    // Pour la gestion des souscriptions
    private destroy$ = new Subject<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dashboardService: DashboardService,
        private rentalService: RentalService,
        private snackBar: MatSnackBar,
        public auth: AuthService

) {}

    ngOnInit(): void {
        // Récupérer les stats du dashboard
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
                    console.error('Erreur lors de la récupération des statistiques', error);
                    this.snackBar.open('Erreur lors du chargement des statistiques', 'Fermer', {
                        duration: 5000
                    });
                }
            });
        // Récupérer les dernières locations
        this.rentalService.getRecentRentals()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: rentals => {
                    this.recentRentals = rentals;
                    // Mettre à jour la source de données du tableau
                    this.dataSource.data = this.formatRentalsForTable(rentals);
                    this.isLoading = false;
                },
                error: error => {
                    console.error('Erreur lors de la récupération des locations récentes', error);
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
        // Nettoyage des souscriptions
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Convertit les données du modèle Rental en format adapté au tableau
     */
    private formatRentalsForTable(rentals: Rental[]): any[] {
        return rentals.map(rental => {
            return {
                // Adapter selon la structure réelle de votre modèle Rental
                client: rental.user?.firstname + ' ' + rental.user?.lastname || 'Client inconnu',
                equipment: rental.product?.name || 'Équipement inconnu',
                start: rental.startDate || rental.date,
                end: rental.endDate || '-'
            };
        });
    }

    /**
     * Filtre le tableau selon la saisie utilisateur
     */
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
