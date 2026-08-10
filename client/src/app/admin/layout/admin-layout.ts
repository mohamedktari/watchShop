import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../shared/components/language-switcher/language-switcher';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslateModule, LanguageSwitcher],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="animate-slide-down flex items-center justify-between bg-brand-900 px-6 py-4 text-white">
        <div class="flex items-center gap-6">
          <span class="text-lg font-extrabold text-lime-500">Tivlo Admin</span>
          <nav class="flex gap-4 text-sm font-medium">
            <a
              routerLink="/admin/commandes"
              routerLinkActive="text-lime-500 after:w-full"
              class="relative py-1 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-lime-500 after:transition-all after:duration-300 hover:text-lime-400 hover:after:w-full"
            >
              {{ 'admin.dashboard.title' | translate }}
            </a>
            <a
              routerLink="/admin/produits"
              routerLinkActive="text-lime-500 after:w-full"
              class="relative py-1 transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-lime-500 after:transition-all after:duration-300 hover:text-lime-400 hover:after:w-full"
            >
              {{ 'admin.products.title' | translate }}
            </a>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <app-language-switcher />
          <button
            type="button"
            (click)="logout()"
            class="transform-gpu rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
          >
            {{ 'admin.dashboard.logout' | translate }}
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-6xl animate-fade-in-up px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayout {
  constructor(private auth: AdminAuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
