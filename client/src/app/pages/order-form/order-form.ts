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
import { TUNISIA_CITIES } from '../../shared/data/tunisia-cities';
import { effectivePrice, hasDiscount } from '../../shared/utils/pricing';

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
    adresse: [{ value: '', disabled: true }, Validators.required],
    genre: [''],
    age: [null as number | null, [Validators.min(1), Validators.max(120)]],
  });

  private quantity = toSignal(this.form.controls.quantity.valueChanges, {
    initialValue: this.form.controls.quantity.value,
  });

  subtotal = computed(() => {
    const p = this.product();
    return (p ? effectivePrice(p) : 0) * (this.quantity() || 0);
  });
  total = computed(() => this.subtotal() + this.deliveryFee);

  cities = TUNISIA_CITIES;

  private selectedCityName = toSignal(this.form.controls.ville.valueChanges, {
    initialValue: this.form.controls.ville.value,
  });

  selectedCity = computed(() => this.cities.find((c) => c.city === this.selectedCityName()) ?? null);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (!productId) return;
    this.productService.getOne(productId).subscribe((product) => this.product.set(product));

    this.form.controls.ville.valueChanges.subscribe((cityName) => {
      this.form.controls.adresse.setValue('');
      if (this.cities.some((c) => c.city === cityName)) {
        this.form.controls.adresse.enable();
      } else {
        this.form.controls.adresse.disable();
      }
    });
  }

  name(p: Product): string {
    return this.lang.getCurrentLanguage() === 'ar' ? p.nameAr : p.nameFr;
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
        ville: value.ville!,
        adresse: value.adresse!,
        genre: value.genre ? (value.genre as 'HOMME' | 'FEMME') : null,
        age: value.age ?? null,
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
