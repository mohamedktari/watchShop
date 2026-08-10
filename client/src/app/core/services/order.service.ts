import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewOrderPayload, Order, OrderStatus } from '../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  create(payload: NewOrderPayload): Observable<{ message: string; order: Order }> {
    return this.http.post<{ message: string; order: Order }>(this.baseUrl, payload);
  }

  listAdmin(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/admin/all`);
  }

  updateStatus(id: string, statut: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}/statut`, { statut });
  }
}
