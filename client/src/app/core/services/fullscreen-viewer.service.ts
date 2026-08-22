import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FullscreenViewerService {
  readonly images = signal<string[] | null>(null);
  readonly index = signal(0);

  open(images: string[], startIndex = 0): void {
    if (images.length === 0) return;
    this.images.set(images);
    this.index.set(startIndex);
  }

  close(): void {
    this.images.set(null);
  }

  next(): void {
    const imgs = this.images();
    if (!imgs) return;
    this.index.set((this.index() + 1) % imgs.length);
  }

  prev(): void {
    const imgs = this.images();
    if (!imgs) return;
    this.index.set((this.index() - 1 + imgs.length) % imgs.length);
  }
}
