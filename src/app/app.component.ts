import {Component, computed, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleService } from './services/title.service';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'AltaTech';

    /**
     * Constructeur du composant
     * @param titleService - Service injecté pour gérer les titres des pages
     */
    constructor(private titleService: TitleService) {}

    /**
     * Méthode du cycle de vie d'Angular
     * Appelée après la création du composant
     * Initialise le service de titre pour gérer dynamiquement
     * les titres des pages en fonction de la navigation
     */

    ngOnInit() {
        this.titleService.initializeTitleService();
    }
}
