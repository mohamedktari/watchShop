import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, skip } from 'rxjs';

declare const fbq: ((...args: unknown[]) => void) | undefined;

// The base pixel + first PageView are fired by the inline script in index.html
// (fires before Angular even bootstraps). This service only handles subsequent
// in-app navigations, which a single-page app wouldn't otherwise report to Meta
// since there's no full page reload to trigger the pixel's own tracking.
@Injectable({ providedIn: 'root' })
export class MetaPixelService {
  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        skip(1)
      )
      .subscribe(() => {
        if (typeof fbq === 'function') {
          fbq('track', 'PageView');
        }
      });
  }
}
