import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { UserService } from '../../services/user.service';

// Type représentant un élément de menu
export type MenuItem = {
    icon: string;       // Nom du fichier icône (ex: 'dashboard.svg')
    label: string;      // Texte affiché
    route?: string;     // Lien Angular
    roles?: string[];   // Rôles autorisés (optionnel, sinon visible pour tous)
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
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

    // Données affichées dans le footer
    userName: string = 'Utilisateur';
    userPhoto: string = 'assets/profiles/avatar-1.jpg';
    userRole: string = ''; // Rôle affiché

    // État de la sidebar (true = réduite)
    collapsed: boolean = false;

    // Liste finale affichée dans le menu après filtrage
    filteredMenuItems: MenuItem[] = [];

    constructor(
        public auth: AuthService, // Service d'authentification
        private userService: UserService, // Service utilisateur (nom, photo, etc.)
        private router: Router
    ) {}

    // Permet de recevoir la valeur de "collapsed" depuis le parent
    @Input() set setCollapsed(val: boolean) {
        this.collapsed = val;
    }

    ngOnInit(): void {
        // Récupère les infos de l'utilisateur (nom, photo) depuis l'API
        this.userService.getCurrentUser().subscribe({
            next: user => {
                // Nom complet
                this.userName = user.firstname;

                // Photo de profil : soit URL depuis le back, soit avatar généré
                if (user.photoUrl) {
                    this.userPhoto = user.photoUrl;
                } else {
                    const fullName = `${user.firstname} ${user.lastname}`;
                    const encodedName = encodeURIComponent(fullName.trim());
                    this.userPhoto = `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=fff&rounded=true`;
                }

                // Récupère le rôle déjà normalisé depuis AuthService
                // (ex: "ADMIN", "TECH", "CLIENT")
                this.userRole = this.auth.getUserRole() ?? '';

                // Filtre le menu en fonction des rôles
                this.filteredMenuItems = this.mainMenuItems.filter(item =>
                    !item.roles || item.roles.includes(this.userRole)
                );
            },
            error: () => {
                // Si erreur, on met des valeurs par défaut
                this.userName = 'Utilisateur';
                this.userPhoto = 'assets/profiles/avatar-1.jpg';
                this.userRole = '';
                this.filteredMenuItems = this.mainMenuItems; // Affiche tout si pas de rôle
            }
        });
    }

    // Déconnexion + redirection
    onSignOut(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    // Taille de la photo selon état de la sidebar
    profilePicSize(): string {
        return this.collapsed ? '32' : '100';
    }

    // Menu principal : certains items ont une restriction de rôles
    mainMenuItems: MenuItem[] = [
        { icon: 'layout-dashboard.svg', label: 'Dashboard', route: 'dashboard' },
        { icon: 'monitor.svg', label: 'Équipements', route: 'equipments' },
        { icon: 'calendar-check.svg', label: 'Réservations', route: 'rental', roles: ['ADMIN', 'TECH'] },
        { icon: 'history.svg', label: 'Mes Réservations', route: 'my-rentals', roles: ['CLIENT'] },
        { icon: 'flag.svg', label: 'Signalements', route: 'all-reports', roles: ['ADMIN', 'TECH'] },
        { icon: 'flag.svg', label: 'Mes signalements', route: 'my-reports', roles: ['CLIENT'] },
        { icon: 'users.svg', label: 'Clients', route: 'clients', roles: ['ADMIN', 'TECH'] },
        { icon: 'user-cog.svg', label: 'Team', route: 'team', roles: ['ADMIN', 'TECH'] },
    ];

    // Menu secondaire (ici pas de restriction)
    secondaryMenuItems: MenuItem[] = [

        { icon: 'message-square.svg', label: 'Contact', route: 'contact' }
    ];

    // Tracking pour éviter les recréations inutiles d'éléments Angular
    tracksByIndex(index: number, item: MenuItem): number {
        return index;
    }
}
