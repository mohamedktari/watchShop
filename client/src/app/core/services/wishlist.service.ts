import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'watchshop_wishlist';

  readonly ids = signal<Set<string>>(this.load());

  private load(): Set<string> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set<string>();
    }
  }

  isSaved(id: string): boolean {
    return this.ids().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.ids());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.ids.set(next);
    localStorage.setItem(this.storageKey, JSON.stringify(Array.from(next)));
  }
}
