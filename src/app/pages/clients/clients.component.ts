import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef
} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ClientService } from '../../services/clients.service';
import { Client } from '../../models/client';
import { ClientDetailsDialogComponent } from './client-details-dialog.component';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    imports: [
        MatButton,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatFormField,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatInput,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatTable,
        MatTooltip,
        MatLabel,

    ],
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    displayedColumns: string[] = ['firstname', 'lastname', 'company', 'email', 'actions'];
    dataSource = new MatTableDataSource<Client>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private clientService: ClientService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadClients();
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onAdd(): void {
        this.dialog.open(ClientDetailsDialogComponent, {
            width: '500px',
            data: {} as Client
        });
    }

    onView(client: Client): void {
        this.dialog.open(ClientDetailsDialogComponent, {
            width: '500px',
            data: client
        });
    }

    onEdit(client: Client): void {
        console.log('Éditer client:', client);
        this.dialog.open(ClientDetailsDialogComponent, {
            width: '500px',
            data: { ...client }
        });
    }

    onDelete(client: Client): void {
        const dialogRef = this.dialog.open(ClientDetailsDialogComponent, {
            width: '400px',
            data: {
                title: 'Confirmation de suppression',
                message: 'Êtes-vous sûr de vouloir supprimer ce client ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.clientService.deleteClient(client.id).pipe(
                    catchError(error => {
                        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
                            duration: 3000,
                            panelClass: ['error-snackbar']
                        });
                        return of(null);
                    })
                ).subscribe(() => {
                    this.loadClients();
                    this.snackBar.open('Client supprimé avec succès', 'Fermer', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom'
                    });
                });
            }
        });
    }

    private loadClients(): void {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.dataSource.data = data.filter(c => c.role === 'CLIENT');
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
}
