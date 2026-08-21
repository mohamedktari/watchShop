import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductQuickViewService } from '../../../core/services/product-quick-view.service';
import { LanguageService } from '../../../core/services/language.service';
import { hasDiscount } from '../../utils/pricing';
import { CloudinaryQualityPipe } from '../../pipes/cloudinary-quality.pipe';

@Component({
  selector: 'app-quick-view-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, CloudinaryQualityPipe],
  templateUrl: './quick-view-dialog.html',
})
export class QuickViewDialog {
  quickView = inject(ProductQuickViewService);
  private lang = inject(LanguageService);
  private router = inject(Router);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.quickView.close();
  }

  name(): string {
    const p = this.quickView.product();
    if (!p) return '';
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
  }

  description(): string {
    const p = this.quickView.product();
    if (!p) return '';
    return this.lang.getCurrentLanguage() === 'ar' ? p.descriptionAr : p.descriptionFr;
  }

  hasDiscount(): boolean {
    const p = this.quickView.product();
    return p ? hasDiscount(p) : false;
  }

  close(): void {
    this.quickView.close();
  }

  navigate(path: (string | number)[]): void {
    this.quickView.close();
    this.router.navigate(path);
  }
}
