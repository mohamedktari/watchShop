import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminSession {
  token: string;
  admin: { id: string; email: string; nom: string };
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly tokenKey = 'watchshop_admin_token';
  private readonly adminKey = 'watchshop_admin_info';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AdminSession> {
    return this.http.post<AdminSession>(`${environment.apiUrl}/admin/auth/login`, { email, password }).pipe(
      tap((session) => {
        localStorage.setItem(this.tokenKey, session.token);
        localStorage.setItem(this.adminKey, JSON.stringify(session.admin));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAdminInfo(): AdminSession['admin'] | null {
    const raw = localStorage.getItem(this.adminKey);
    return raw ? JSON.parse(raw) : null;
  }
}
