import {Component, computed, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CustomSidenavComponent} from './components/custom-sidenav/custom-sidenav.component';
import {AuthService} from './services/auth.service';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet,
        RouterLink,
        MatToolbarModule, MatButtonModule,
        MatIconModule, MatSidenavModule, CustomSidenavComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'front-angular';
    collapsed = signal(false);
    sidenavWidth = computed(() => (this.auth.connected ? (this.collapsed() ? "65px" : "250px") : "0px"));
    auth = inject(AuthService)

    onSignOut() {
        localStorage.removeItem("jwt")
        this.auth.connected = false

    }


}
