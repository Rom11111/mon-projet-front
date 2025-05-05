import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {Client, ClientService} from '../../services/clients.service';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
    templateUrl: "./clients.component.html",
    styleUrl: "./clients.component.scss"
})
export class ClientListComponent implements OnInit {
    clients: Client[] = [];
    clientService= inject(ClientService)

    ngOnInit(): void {
        this.clientService.getClients().subscribe((data:any) => this.clients = data);
    }
}
