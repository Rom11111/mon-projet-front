import {Component, computed, input, Input, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatLineModule} from '@angular/material/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

export type MenuItem = {
    icon: string;
    label: string;
    route?:string;
}

@Component({
    // standalone: true,
    selector: 'app-custom-sidenav',
    imports: [
        CommonModule,
        MatLineModule,
        MatListModule,
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage,
    ],
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
            icon: "layout-dashboard.svg",
            label: "Dashboard",
            route: "dashboard",
        },

        {
            icon: "monitor.svg",
            label: "Équipements",
            route: "equipments",
        },
        {
            icon: "calendar-check.svg",
            label: "Réservations",
            route: "booking",
        },
        {
            icon: "users.svg",
            label: "Clients",
            route: "clients",
        },

        {
            icon: "message-square.svg",
            label: "Contact",
            route: "contact",
        },
        {
            icon: "settings.svg",
            label: "Réglages",
            route: "settings",
        },

    ]);

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        // Enregistrez chaque icône SVG
        this.matIconRegistry.addSvgIcon(
            'layout-dashboard',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/dashboard.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'monitor',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/monitor.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'calendar-check',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'users',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/users.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'message-square',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/message.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'settings',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg')
        );
    }

    tracksByIndex(index: number, item: MenuItem) {return index; }
    profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
