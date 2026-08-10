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
      <header class="flex items-center justify-between bg-brand-900 px-6 py-4 text-white">
        <div class="flex items-center gap-6">
          <span class="text-lg font-extrabold text-lime-500">Tivlo Admin</span>
          <nav class="flex gap-4 text-sm font-medium">
            <a routerLink="/admin/commandes" routerLinkActive="text-lime-500" class="hover:text-brand-100">
              {{ 'admin.dashboard.title' | translate }}
            </a>
            <a routerLink="/admin/produits" routerLinkActive="text-lime-500" class="hover:text-brand-100">
              {{ 'admin.products.title' | translate }}
            </a>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <app-language-switcher />
          <button type="button" (click)="logout()" class="rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">
            {{ 'admin.dashboard.logout' | translate }}
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
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
