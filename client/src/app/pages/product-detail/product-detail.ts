import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { FullscreenViewerService } from '../../core/services/fullscreen-viewer.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../shared/models/product.model';
import { hasDiscount } from '../../shared/utils/pricing';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';
import { QuantityStepper } from '../../shared/components/quantity-stepper/quantity-stepper';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    CloudinaryQualityPipe,
    QuantityStepper,
    ProductCard,
    RevealDirective,
    MagneticDirective,
  ],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainCta') mainCtaRef?: ElementRef<HTMLElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);
  wishlist = inject(WishlistService);
  recentlyViewed = inject(RecentlyViewedService);
  fullscreenViewer = inject(FullscreenViewerService);
  public lang = inject(LanguageService);

  product = signal<Product | null>(null);
  activeImage = signal(0);
  quantity = signal(1);
  related = signal<Product[]>([]);
  heartBump = signal(false);
  ctaVisible = signal(true);

  private ctaObserver?: IntersectionObserver;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getOne(id).subscribe((product) => {
      this.product.set(product);
      this.recentlyViewed.track(product._id);
      this.loadRelated(product);
      // The CTA only enters the DOM once this signal update renders - defer one
      // tick so the ViewChild query below actually finds it.
      setTimeout(() => this.observeCta(), 0);
    });
  }

  ngAfterViewInit(): void {
    // Handles the case where the CTA is already in the DOM by the time the view
    // settles (e.g. a cached/instant response) - observeCta() itself is a no-op
    // if the element or observer already exist, so this can't double-attach.
    this.observeCta();
  }

  ngOnDestroy(): void {
    this.ctaObserver?.disconnect();
  }

  private observeCta(): void {
    if (this.ctaObserver) return;
    const el = this.mainCtaRef?.nativeElement;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    this.ctaObserver = new IntersectionObserver(([entry]) => this.ctaVisible.set(entry.isIntersecting), { threshold: 0 });
    this.ctaObserver.observe(el);
  }

  private loadRelated(product: Product): void {
    if (!product.category) return;
    this.productService.list().subscribe((products) => {
      this.related.set(products.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 3));
    });
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

  saved(id: string): boolean {
    return this.wishlist.isSaved(id);
  }

  toggleWishlist(id: string): void {
    const nowSaved = !this.saved(id);
    this.wishlist.toggle(id);
    this.heartBump.set(true);
    setTimeout(() => this.heartBump.set(false), 400);
    this.toast.show(this.translate.instant(nowSaved ? 'toast.wishlistAdd' : 'toast.wishlistRemove'));
  }

  openViewer(p: Product): void {
    this.fullscreenViewer.open(p.images, this.activeImage());
  }

  goToOrder(p: Product): void {
    this.router.navigate(['/commander', p._id], { queryParams: { qty: this.quantity() } });
  }
}
