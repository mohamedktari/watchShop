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

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
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
    telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\s]{6,20}$/)]],
    ville: ['', Validators.required],
  });

  private quantity = toSignal(this.form.controls.quantity.valueChanges, {
    initialValue: this.form.controls.quantity.value,
  });

  subtotal = computed(() => (this.product()?.price ?? 0) * (this.quantity() || 0));
  total = computed(() => this.subtotal() + this.deliveryFee);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (!productId) return;
    this.productService.getOne(productId).subscribe((product) => this.product.set(product));
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
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
        ville: value.ville!,
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
