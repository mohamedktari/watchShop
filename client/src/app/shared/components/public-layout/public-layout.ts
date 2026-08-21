import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { QuickViewDialog } from '../quick-view-dialog/quick-view-dialog';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule, LanguageSwitcher, QuickViewDialog],
  templateUrl: './public-layout.html',
})
export class PublicLayout implements AfterViewInit, OnDestroy {
  @ViewChild('bgVideo') bgVideo?: ElementRef<HTMLVideoElement>;

  private wishlist = inject(WishlistService);
  private router = inject(Router);

  year = new Date().getFullYear();
  mobileMenuOpen = signal(false);
  wishlistCount = computed(() => this.wishlist.ids().size);

  private routerSub: Subscription;

  constructor() {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) this.mobileMenuOpen.set(false);
    });
  }

  ngAfterViewInit(): void {
    const video = this.bgVideo?.nativeElement;
    if (!video) return;
    // Chrome's autoplay policy checks the `muted` JS property, which a static
    // HTML attribute doesn't always reliably set through Angular's renderer.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode) — video stays paused on its poster frame, which is fine.
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
