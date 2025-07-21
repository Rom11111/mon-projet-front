import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-page-header',
    standalone: true,
    templateUrl: './page-header.component.html',
    imports: [
        NgForOf,
        MatIcon,
        RouterLink
    ],
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
    @Input() title = '';
    @Input() breadcrumbs: string[] = []; // exemple : ['Ecommerce', 'Product List']
}

