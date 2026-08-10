import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule, LanguageSwitcher],
  template: `
    <div class="flex min-h-screen flex-col bg-brand-50">
      <header class="bg-brand-900 text-white shadow-lg">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a routerLink="/" class="text-xl font-extrabold tracking-wide text-brand-100">WatchShop</a>
          <app-language-switcher />
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-brand-900 py-6 text-center text-sm text-brand-100">
        © {{ year }} WatchShop
      </footer>
    </div>
  `,
})
export class PublicLayout {
  year = new Date().getFullYear();
}
