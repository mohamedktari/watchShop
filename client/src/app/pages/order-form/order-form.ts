import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { LanguageService } from '../../core/services/language.service';
import { Product } from '../../shared/models/product.model';
import { effectivePrice, hasDiscount } from '../../shared/utils/pricing';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, CloudinaryQualityPipe],
  templateUrl: './order-form.html',
})
export class OrderForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  public lang = inject(LanguageService);

  readonly deliveryFee = 8;

  product = signal<Product | null>(null);
  submitting = signal(false);
  submitted = signal(false);
  errorMsg = signal(false);

  form = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    adresse: ['', Validators.required],
  });

  private quantity = toSignal(this.form.controls.quantity.valueChanges, {
    initialValue: this.form.controls.quantity.value,
  });

  subtotal = computed(() => {
    const p = this.product();
    return (p ? effectivePrice(p) : 0) * (this.quantity() || 0);
  });
  total = computed(() => this.subtotal() + this.deliveryFee);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (!productId) return;
    this.productService.getOne(productId).subscribe((product) => this.product.set(product));
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 8);
    if (digitsOnly !== input.value) {
      this.form.controls.telephone.setValue(digitsOnly);
    }
  }

  hasDiscount(p: Product): boolean {
    return hasDiscount(p);
  }

  submit(): void {
    const p = this.product();
    if (!p || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(false);

    const value = this.form.getRawValue();

    this.orderService
      .create({
        productId: p._id,
        quantity: value.quantity!,
        nom: value.nom!,
        prenom: value.prenom!,
        telephone: value.telephone!,
        adresse: value.adresse!,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMsg.set(true);
        },
      });
  }
}
