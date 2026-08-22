import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  leaving: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'success', duration = 2600): void {
    const id = ++this.nextId;
    this.toasts.update((list) => [...list, { id, message, type, leaving: false }]);
    setTimeout(() => this.startLeave(id), duration);
  }

  private startLeave(id: number): void {
    this.toasts.update((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => this.dismiss(id), 250);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
