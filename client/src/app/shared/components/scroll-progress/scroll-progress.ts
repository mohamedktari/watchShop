import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `
    <div class="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div class="h-full bg-lime-500 transition-[width] duration-150 ease-out" [style.width.%]="progress()"></div>
    </div>
  `,
})
export class ScrollProgress {
  progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    const doc = document.documentElement;
    const height = doc.scrollHeight - doc.clientHeight;
    this.progress.set(height > 0 ? (doc.scrollTop / height) * 100 : 0);
  }
}
