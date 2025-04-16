import {Component, computed, input, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLineModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

export type MenuItem = {
    icon: string;
    label: string;
    route?:string;
}

@Component({
    selector: 'app-custom-sidenav',
    imports: [CommonModule, MatLineModule, MatListModule, MatIconModule, RouterLink, RouterLinkActive],
    templateUrl: './custom-sidenav.component.html',
    styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {

        sideNavCollapsed = signal(false);
        @Input() set collapsed(val: boolean){
            this.sideNavCollapsed.set(val);
        }

    menuItems = signal<MenuItem[]>([
        {
            icon: "dashboard",
            label: "Dashboard",
            route: "dashboard",
        },

        {
            icon: "devices",
            label: "Équipements",
            route: "equipments",
        },
        {
            icon: "calendar_month",
            label: "Réservations",
            route: "booking",
        },
        {
            icon: "group",
            label: "Clients",
            route: "clients",
        },
        {
            icon: "settings",
            label: "Réglages",
            route: "settings",
        },

    ]);

    profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
