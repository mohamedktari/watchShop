import { Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductQuickViewService {
  readonly product = signal<Product | null>(null);

  open(product: Product): void {
    this.product.set(product);
  }

  close(): void {
    this.product.set(null);
  }
}
