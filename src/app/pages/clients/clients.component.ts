import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ClientService, Client } from './clients.service';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
    template:
}

export class ClientListComponent implements OnInit {
    clients: Client[] = [];

    constructor(private clientService: ClientService) {}

    ngOnInit(): void {
        this.clientService.getClients().subscribe(data => this.clients = data);
    }
}
