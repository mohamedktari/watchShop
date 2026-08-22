import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { Product } from '../../shared/models/product.model';
import { hasDiscount } from '../../shared/utils/pricing';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';
import { SplitWordsPipe } from '../../shared/pipes/split-words.pipe';

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'newest';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ProductCard,
    RevealDirective,
    MagneticDirective,
    TiltDirective,
    CloudinaryQualityPipe,
    SplitWordsPipe,
  ],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  wishlist = inject(WishlistService);
  recentlyViewed = inject(RecentlyViewedService);
  public lang = inject(LanguageService);

  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string>('');
  search = signal('');
  sort = signal<SortOption>('default');
  favoritesOnly = signal(false);
  maxPrice = signal<number | null>(null);

  categories = computed(() => {
    const set = new Set(this.products().map((p) => p.category).filter((c): c is string => !!c));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  collections = computed(() => {
    const map = new Map<string, Product>();
    for (const p of this.products()) {
      if (p.category && !map.has(p.category)) map.set(p.category, p);
    }
    return Array.from(map.entries()).map(([category, product]) => ({ category, product }));
  });

  signatureProduct = computed<Product | null>(() => this.products()[0] ?? null);

  editorialProducts = computed(() => this.products().slice(0, 3));

  recentlyViewedProducts = computed(() => {
    const byId = new Map(this.products().map((p) => [p._id, p]));
    return this.recentlyViewed
      .ids()
      .map((id) => byId.get(id))
      .filter((p): p is Product => !!p);
  });

  faqOpenIndex = signal<number | null>(null);

  priceBounds = computed(() => {
    const prices = this.products().map((p) => this.effective(p));
    if (prices.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  });

  filteredProducts = computed(() => {
    let list = this.products();

    const cat = this.selectedCategory();
    if (cat) list = list.filter((p) => p.category === cat);

    const term = this.search().trim().toLowerCase();
    if (term) {
      list = list.filter((p) => p.nameFr.toLowerCase().includes(term) || p.nameAr.toLowerCase().includes(term));
    }

    const price = this.maxPrice();
    if (price != null) list = list.filter((p) => this.effective(p) <= price);

    if (this.favoritesOnly()) {
      const ids = this.wishlist.ids();
      list = list.filter((p) => ids.has(p._id));
    }

    const sort = this.sort();
    if (sort === 'priceAsc') list = [...list].sort((a, b) => this.effective(a) - this.effective(b));
    else if (sort === 'priceDesc') list = [...list].sort((a, b) => this.effective(b) - this.effective(a));
    else if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.favoritesOnly.set(params.get('favoris') === '1');
    });

    this.productService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private effective(p: Product): number {
    return hasDiscount(p) ? (p.discountPrice as number) : p.price;
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category === this.selectedCategory() ? '' : category);
  }

  selectCollection(category: string): void {
    this.selectedCategory.set(category);
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onSortChange(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortOption);
  }

  onMaxPriceInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.maxPrice.set(value ? Number(value) : null);
  }

  clearFavoritesFilter(): void {
    this.favoritesOnly.set(false);
  }

  toggleFaq(index: number): void {
    this.faqOpenIndex.set(this.faqOpenIndex() === index ? null : index);
  }

  resetFilters(): void {
    this.selectedCategory.set('');
    this.search.set('');
    this.sort.set('default');
    this.maxPrice.set(null);
    this.favoritesOnly.set(false);
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
  }

  description(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.descriptionAr : p.descriptionFr;
  }

  hasDiscount(p: Product): boolean {
    return hasDiscount(p);
  }
}
