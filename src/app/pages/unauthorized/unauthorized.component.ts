import { Component } from '@angular/core';
import {PageHeaderComponent} from '../../components/page-header/page-header.component';
import {MatCard} from '@angular/material/card';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    imports: [
        PageHeaderComponent,
        MatCard,
        MatAnchor,
        RouterLink
    ],
    styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {}

