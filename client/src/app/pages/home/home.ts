import { Component, OnInit, computed, signal } from '@angular/core';
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
export class Home implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string>('');

  categories = computed(() => {
    const set = new Set(this.products().map((p) => p.category).filter((c): c is string => !!c));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    return cat ? this.products().filter((p) => p.category === cat) : this.products();
  });

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

  setCategory(category: string): void {
    this.selectedCategory.set(category === this.selectedCategory() ? '' : category);
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
  }

  hasDiscount(p: Product): boolean {
    return hasDiscount(p);
  }
}
