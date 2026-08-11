import { Product } from '../models/product.model';

export function hasDiscount(product: Pick<Product, 'price' | 'discountPrice'>): boolean {
  return product.discountPrice != null && product.discountPrice < product.price;
}

export function effectivePrice(product: Pick<Product, 'price' | 'discountPrice'>): number {
  return hasDiscount(product) ? (product.discountPrice as number) : product.price;
}
