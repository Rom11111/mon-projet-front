import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

export type MenuItem = {
    icon: string;
    label: string;
    route?: string;
};

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
        MatSidenav
    ],
    templateUrl: './client-layout.component.html',
    styleUrls: ['./client-layout.component.scss']
})
export class ClientLayoutComponent implements OnInit {

    userName: string = 'Utilisateur';
    userPhoto: string = 'assets/profiles/avatar-1.jpg';
    userRole: string = '';
    collapsed: boolean = false;

    constructor(
        public auth: AuthService,
        private userService: UserService,
        private router: Router,

    ) {}

    @Input() set setCollapsed(val: boolean) {
        this.collapsed = val;
    }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
            next: user => {
                this.userName = user.firstname;
                this.userRole = user.role;

                if (user.photoUrl) {
                    this.userPhoto = user.photoUrl;
                } else {
                    const fullName = `${user.firstname} ${user.lastname}`;
                    const encodedName = encodeURIComponent(fullName.trim());
                    this.userPhoto = `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=fff&rounded=true`;
                }
            },
            error: () => {
                this.userName = 'Utilisateur';
                this.userPhoto = 'assets/profiles/avatar-1.jpg';
                this.userRole = '';
            }
        });
    }

    onSignOut(): void {
        this.auth.logout(); // Déconnexion
        this.router.navigate(['/login']); // Redirection
    }

    profilePicSize(): string {
        return this.collapsed ? '32' : '100';
    }

    mainMenuItems: MenuItem[] = [
        { icon: 'layout-dashboard.svg', label: 'Dashboard', route: 'dashboard' },
        { icon: 'monitor.svg', label: 'Équipements', route: 'equipments' },
        { icon: 'calendar-check.svg', label: 'Réservations', route: 'rental' },
        { icon: 'history.svg', label: 'Mes Réservations', route: 'my-rentals' },
        { icon: 'users.svg', label: 'Clients', route: 'clients' }
    ];

    secondaryMenuItems: MenuItem[] = [
        { icon: 'user-cog.svg', label: 'Team', route: 'team' },
        { icon: 'message-square.svg', label: 'Contact', route: 'contact' }
    ];

    tracksByIndex(index: number, item: MenuItem): number {
        return index;
    }
}
