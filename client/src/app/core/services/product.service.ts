import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  listAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/admin/all`);
  }

  create(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, formData);
  }

  update(id: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  moveToTop(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/move-to-top`, {});
  }
}
