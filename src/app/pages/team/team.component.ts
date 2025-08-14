import { Component, OnInit, ViewChild } from '@angular/core';
import {
    MatCell, MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientService } from '../../services/clients.service';

import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Client} from '../../models/client';
import {Role} from '../../models/role.enum';
import {PageHeaderComponent} from '../../components/page-header/page-header.component';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';



@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    imports: [
        MatFormField,
        MatTable,
        MatInput,
        MatSort,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatPaginator,
        MatRow,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRowDef,
        MatFormField,
        MatSelect,
        MatOption,
        NgForOf,
        MatLabel,
        MatIcon,
        PageHeaderComponent
    ],
    styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
    displayedColumns: string[] = ['firstname', 'lastname', 'email', 'role'];
    dataSource = new MatTableDataSource<Client>();
    category = ['ADMIN', 'TECH'];
    selectedCategory : string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getAllUsers().subscribe((response: any) => {
            console.log("Tous les utilisateurs :", response);

            const users: User[] = response.content;

            this.dataSource.data = users.filter(u =>
                u.role === Role.ADMIN || u.role === Role.TECH
            );

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate = (data: User, filter: string) => {
                return !filter || data.role === filter;
            };
        });
    }

    // Méthode appelée lors du changement de catégorie
    applyCategoryFilter(category: string) {
        this.selectedCategory = category;
        this.dataSource.filter = category;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
