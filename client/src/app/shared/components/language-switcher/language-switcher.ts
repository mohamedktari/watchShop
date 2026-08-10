import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="flex items-center gap-1 rounded-full bg-white/10 p-1 text-sm font-medium">
      <button
        type="button"
        (click)="setLang('fr')"
        class="rounded-full px-3 py-1 transition"
        [class.bg-white]="current() === 'fr'"
        [class.text-brand-900]="current() === 'fr'"
        [class.text-white]="current() !== 'fr'"
      >
        FR
      </button>
      <button
        type="button"
        (click)="setLang('ar')"
        class="rounded-full px-3 py-1 transition"
        [class.bg-white]="current() === 'ar'"
        [class.text-brand-900]="current() === 'ar'"
        [class.text-white]="current() !== 'ar'"
      >
        ع
      </button>
    </div>
  `,
})
export class LanguageSwitcher {
  constructor(private lang: LanguageService) {}

  current() {
    return this.lang.getCurrentLanguage();
  }

  setLang(lang: 'fr' | 'ar') {
    this.lang.setLanguage(lang);
  }
}
