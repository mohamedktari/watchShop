import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../shared/models/product.model';
import { hasDiscount } from '../../shared/utils/pricing';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';
import { QuantityStepper } from '../../shared/components/quantity-stepper/quantity-stepper';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, CloudinaryQualityPipe, QuantityStepper, ProductCard],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  wishlist = inject(WishlistService);
  public lang = inject(LanguageService);

  product = signal<Product | null>(null);
  activeImage = signal(0);
  quantity = signal(1);
  related = signal<Product[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getOne(id).subscribe((product) => {
      this.product.set(product);
      this.loadRelated(product);
    });
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
    this.wishlist.toggle(id);
  }

  goToOrder(p: Product): void {
    this.router.navigate(['/commander', p._id], { queryParams: { qty: this.quantity() } });
  }
}
