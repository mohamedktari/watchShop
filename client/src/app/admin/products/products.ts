import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { CloudinaryQualityPipe } from '../../shared/pipes/cloudinary-quality.pipe';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CloudinaryQualityPipe],
  templateUrl: './products.html',
})
export class AdminProducts implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  products = signal<Product[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  selectedFiles: File[] = [];
  existingImages = signal<string[]>([]);

  form = this.fb.group({
    nameFr: ['', Validators.required],
    nameAr: ['', Validators.required],
    descriptionFr: [''],
    descriptionAr: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPrice: [null as number | null, [Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productService.listAdmin().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.selectedFiles = [];
    this.existingImages.set([]);
    this.form.reset({ nameFr: '', nameAr: '', descriptionFr: '', descriptionAr: '', price: 0, discountPrice: null, stock: 0, category: '', isActive: true });
    this.showForm.set(true);
  }

  openEdit(product: Product): void {
    this.editingId.set(product._id);
    this.selectedFiles = [];
    this.existingImages.set([...product.images]);
    this.form.reset({
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      descriptionFr: product.descriptionFr,
      descriptionAr: product.descriptionAr,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      category: product.category,
      isActive: product.isActive,
    });
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  removeExistingImage(url: string): void {
    this.existingImages.set(this.existingImages().filter((img) => img !== url));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const formData = new FormData();
    formData.append('nameFr', value.nameFr!);
    formData.append('nameAr', value.nameAr!);
    formData.append('descriptionFr', value.descriptionFr || '');
    formData.append('descriptionAr', value.descriptionAr || '');
    formData.append('price', String(value.price));
    formData.append('discountPrice', value.discountPrice != null ? String(value.discountPrice) : '');
    formData.append('stock', String(value.stock));
    formData.append('category', value.category || '');
    formData.append('isActive', String(value.isActive));
    this.selectedFiles.forEach((file) => formData.append('images', file));

    const id = this.editingId();
    if (id) {
      formData.append('existingImages', JSON.stringify(this.existingImages()));
    }
    const request = id ? this.productService.update(id, formData) : this.productService.create(formData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  remove(product: Product): void {
    if (!confirm(this.translate.instant('admin.products.confirmDelete'))) return;
    this.productService.delete(product._id).subscribe(() => this.load());
  }

  moveToTop(product: Product): void {
    this.productService.moveToTop(product._id).subscribe(() => this.load());
  }
}
