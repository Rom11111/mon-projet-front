import {Component, computed, inject, Input, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatLineModule} from '@angular/material/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconAnchor, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {AuthService} from '../../services/auth.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';

export type MenuItem = {
    icon: string;
    label: string;
    route?:string;
}
@Component({
    standalone: true,
    selector: 'app-main-layout',
    imports: [
        CommonModule,
        MatLineModule,
        MatListModule,
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage,
        MatIconButton,
        MatTooltip,
        MatIconAnchor,
        RouterOutlet,
        MatSidenavContent,
        MatSidenavContainer,
        MatSidenav,
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']

})
export class MainLayoutComponent {


    darkMode = signal(false);

    auth = inject(AuthService);
    overlay = inject(OverlayContainer);

    sideNavCollapsed = signal(false);
    @Input() set collapsed(val: boolean){
        this.sideNavCollapsed.set(val);
    }

    toggleDarkMode() {
        this.darkMode.update((v) => !v);
        const isDark = this.darkMode();
        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark-theme');
            this.overlay.getContainerElement().classList.add('dark-theme');
        } else {
            html.classList.remove('dark-theme');
            this.overlay.getContainerElement().classList.remove('dark-theme');
        }
    }

    onSignOut() {
        localStorage.removeItem("jwt");
        this.auth.connected = false;
    }

    // GROUPE 1 : Liens de navigation principaux
    mainMenuItems = signal<MenuItem[]>([
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
            route: "rental",
        },
        {
            icon: "users.svg",
            label: "Clients",
            route: "clients",
        },
    ]);
    // GROUPE 2 : Liens secondaires
    secondaryMenuItems = signal<MenuItem[]>([
        {
            icon: "user-cog.svg",
            label: "Team",
            route: "team",
        },
        {
            icon: "message-square.svg",
            label: "Contact",
            route: "contact",
        },
    ]);


    tracksByIndex(index: number, item: MenuItem) {return index; }
    profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
// collapsed = signal(false);
// darkMode = signal(false);
//
// auth = inject(AuthService);
// overlay = inject(OverlayContainer);
//
// sidenavWidth = computed(() =>
//     this.auth.connected ? (this.collapsed() ? "65px" : "250px") : "0px"
// );
//
// onSignOut() {
//     localStorage.removeItem("jwt");
//     this.auth.connected = false;
// }
