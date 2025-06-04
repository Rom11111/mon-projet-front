import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component';
import { AuthService } from './services/auth.service';
import { MatTooltip } from '@angular/material/tooltip';
import { OverlayContainer } from '@angular/cdk/overlay';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        CustomSidenavComponent,
        MatTooltip,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'front-angular';
    collapsed = signal(false);
    darkMode = signal(false);

    auth = inject(AuthService);
    overlay = inject(OverlayContainer);

    sidenavWidth = computed(() =>
        this.auth.connected ? (this.collapsed() ? "65px" : "250px") : "0px"
    );

    onSignOut() {
        localStorage.removeItem("jwt");
        this.auth.connected = false;
    }


}
