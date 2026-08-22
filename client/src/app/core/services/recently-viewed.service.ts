import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  private readonly storageKey = 'watchshop_recently_viewed';
  private readonly max = 8;

  readonly ids = signal<string[]>(this.load());

  private load(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  track(id: string): void {
    const next = [id, ...this.ids().filter((x) => x !== id)].slice(0, this.max);
    this.ids.set(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }
}
