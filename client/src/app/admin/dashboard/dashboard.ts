import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../core/services/order.service';
import { LanguageService } from '../../core/services/language.service';
import { Order, OrderStatus } from '../../shared/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.html',
})
export class AdminDashboard implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService, public lang: LanguageService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.orderService.listAdmin().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  productName(order: Order): string {
    return this.lang.getCurrentLanguage() === 'ar' ? order.product.nameAr : order.product.nameFr;
  }

  changeStatus(order: Order, statut: OrderStatus): void {
    this.orderService.updateStatus(order._id, statut).subscribe((updated) => {
      this.orders.update((list) => list.map((o) => (o._id === updated._id ? updated : o)));
    });
  }

  statusClass(statut: OrderStatus): string {
    switch (statut) {
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-700';
      case 'ANNULEE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  }
}
