import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { Product } from '../../shared/models/product.model';
import { hasDiscount } from '../../shared/utils/pricing';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, CloudinaryQualityPipe],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product = signal<Product | null>(null);
  activeImage = signal(0);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getOne(id).subscribe((product) => this.product.set(product));
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
