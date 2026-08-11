import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule, LanguageSwitcher],
  template: `
    <div class="relative flex min-h-screen flex-col">
      <video #bgVideo autoplay muted loop playsinline preload="auto" class="fixed inset-0 -z-20 h-full w-full object-cover">
        <source src="/assets/video/backgrounshop.mp4" type="video/mp4" />
      </video>
      <div class="fixed inset-0 -z-10 bg-brand-900/70"></div>

      <header class="animate-slide-down border-b border-white/10 bg-brand-900/60 text-white shadow-lg backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a routerLink="/" class="transition-transform duration-200 hover:scale-105">
            <img src="/assets/logo.png" alt="Tivlo Store" class="h-9 w-auto md:h-10" />
          </a>
          <app-language-switcher />
        </div>
      </header>

      <main class="relative flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-white/10 bg-brand-900/60 py-6 text-center text-sm text-brand-100 backdrop-blur-md">
        © {{ year }} Tivlo
      </footer>
    </div>
  `,
})
export class PublicLayout implements AfterViewInit {
  @ViewChild('bgVideo') bgVideo?: ElementRef<HTMLVideoElement>;

  year = new Date().getFullYear();

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
}
