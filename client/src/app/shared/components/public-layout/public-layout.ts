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
      <header class="animate-slide-down bg-brand-900 text-white shadow-lg">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a routerLink="/" class="transition-transform duration-200 hover:scale-105">
            <img src="/assets/logo.png" alt="Tivlo Store" class="h-9 w-auto md:h-10" />
          </a>
          <app-language-switcher />
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-brand-900 py-6 text-center text-sm text-brand-100">
        © {{ year }} Tivlo
      </footer>
    </div>
  `,
})
export class PublicLayout {
  year = new Date().getFullYear();
}
