import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  initializeTitleService() {
    const appName = 'AltaTech';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute.firstChild;
      let routeTitle = '';

      while (route) {
        if (route.firstChild) {
          route = route.firstChild;
        } else {
          routeTitle = route.snapshot.data['title'];
          break;
        }
      }

      if (routeTitle) {
        this.title.setTitle(`${routeTitle} - ${appName}`);
      } else {
        this.title.setTitle(appName);
      }
    });
  }
}
