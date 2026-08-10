import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'fr' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'watchshop_lang';

  constructor(private translate: TranslateService) {
    translate.addLangs(['fr', 'ar']);
    const saved = (localStorage.getItem(this.storageKey) as Lang | null) || 'fr';
    this.setLanguage(saved);
  }

  setLanguage(lang: Lang): void {
    this.translate.use(lang);
    localStorage.setItem(this.storageKey, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLanguage(): Lang {
    return (this.translate.currentLang as Lang) || 'fr';
  }
}
