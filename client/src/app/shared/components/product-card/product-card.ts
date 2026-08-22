import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../models/product.model';
import { hasDiscount as hasDiscountUtil } from '../../utils/pricing';
import { ImageCarousel } from '../image-carousel/image-carousel';
import { LanguageService } from '../../../core/services/language.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductQuickViewService } from '../../../core/services/product-quick-view.service';
import { ToastService } from '../../../core/services/toast.service';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ImageCarousel, MagneticDirective],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  private lang = inject(LanguageService);
  private wishlist = inject(WishlistService);
  private quickView = inject(ProductQuickViewService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  heartBump = signal(false);

  name(): string {
    return this.lang.getCurrentLanguage() === 'ar' ? this.product.nameAr : this.product.nameFr;
  }

  hasDiscount(): boolean {
    return hasDiscountUtil(this.product);
  }

  discountPercent(): number {
    if (!this.product.discountPrice || !this.hasDiscount()) return 0;
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }

  saved(): boolean {
    return this.wishlist.isSaved(this.product._id);
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const nowSaved = !this.saved();
    this.wishlist.toggle(this.product._id);
    this.heartBump.set(true);
    setTimeout(() => this.heartBump.set(false), 400);
    this.toast.show(this.translate.instant(nowSaved ? 'toast.wishlistAdd' : 'toast.wishlistRemove'));
  }

  onQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickView.open(this.product);
  }
}
