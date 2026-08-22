import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { QuickViewDialog } from '../quick-view-dialog/quick-view-dialog';
import { FullscreenViewer } from '../fullscreen-viewer/fullscreen-viewer';
import { ToastContainer } from '../toast-container/toast-container';
import { ScrollProgress } from '../scroll-progress/scroll-progress';
import { AnnouncementBar } from '../announcement-bar/announcement-bar';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    TranslateModule,
    LanguageSwitcher,
    QuickViewDialog,
    FullscreenViewer,
    ToastContainer,
    ScrollProgress,
    AnnouncementBar,
  ],
  templateUrl: './public-layout.html',
})
export class PublicLayout implements AfterViewInit, OnDestroy {
  @ViewChild('bgVideo') bgVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('spotlight') spotlight?: ElementRef<HTMLDivElement>;

  private wishlist = inject(WishlistService);
  private router = inject(Router);

  year = new Date().getFullYear();
  mobileMenuOpen = signal(false);
  scrolled = signal(false);
  wishlistCount = computed(() => this.wishlist.ids().size);

  private routerSub: Subscription;
  private isCoarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  private parallaxFrame: number | null = null;

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
    if (this.parallaxFrame != null) cancelAnimationFrame(this.parallaxFrame);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  // Cinematic cursor spotlight + very subtle hero parallax. Desktop only,
  // rAF-throttled so it never runs more than once per frame.
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isCoarsePointer || this.parallaxFrame != null) return;
    const { clientX, clientY } = event;
    this.parallaxFrame = requestAnimationFrame(() => {
      this.parallaxFrame = null;
      const xPct = (clientX / window.innerWidth) * 100;
      const yPct = (clientY / window.innerHeight) * 100;
      const spot = this.spotlight?.nativeElement;
      if (spot) {
        spot.style.setProperty('--spot-x', `${xPct}%`);
        spot.style.setProperty('--spot-y', `${yPct}%`);
      }
      const video = this.bgVideo?.nativeElement;
      if (video) {
        const dx = (clientX / window.innerWidth - 0.5) * 10;
        const dy = (clientY / window.innerHeight - 0.5) * 10;
        video.style.transform = `scale(1.04) translate(${dx}px, ${dy}px)`;
      }
    });
  }
}
