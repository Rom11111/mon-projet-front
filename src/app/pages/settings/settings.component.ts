import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {PageHeaderComponent} from '../../components/page-header/page-header.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatSelectModule,
        PageHeaderComponent
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    email = '';
    theme: 'light' | 'dark' = 'light';
    notifications = true;
    language = 'fr';

    saveSettings() {
        alert('Réglages sauvegardés !');
    }

    resetSettings() {
        this.email = '';
        this.theme = 'light';
        this.notifications = true;
        this.language = 'fr';
    }

    logout() {
        alert('Déconnexion...');
    }
}
