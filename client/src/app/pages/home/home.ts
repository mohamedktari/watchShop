import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { Product } from '../../shared/models/product.model';
import { hasDiscount } from '../../shared/utils/pricing';
import { ImageCarousel } from '../../shared/components/image-carousel/image-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ImageCarousel],
  templateUrl: './home.html',
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService, public lang: LanguageService) {}

  ngOnInit(): void {
    this.productService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ngAfterViewInit(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;
    // Chrome's autoplay policy checks the `muted` JS property, which a static
    // HTML attribute doesn't always reliably set through Angular's renderer.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode) — video stays paused on its poster frame, which is fine.
    });
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
  }

  hasDiscount(p: Product): boolean {
    return hasDiscount(p);
  }
}
