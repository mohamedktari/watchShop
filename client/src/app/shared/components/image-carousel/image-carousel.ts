import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  template: `
    <div
      class="relative h-full w-full select-none overflow-hidden"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      @for (img of images; track img; let i = $index) {
        <img
          [src]="img"
          [alt]="alt"
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          [class.opacity-100]="i === current()"
          [class.opacity-0]="i !== current()"
        />
      }

      @if (images.length > 1) {
        <button
          type="button"
          (click)="prev($event)"
          class="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-label="Image precedente"
        >
          &#8249;
        </button>
        <button
          type="button"
          (click)="next($event)"
          class="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-label="Image suivante"
        >
          &#8250;
        </button>

        <div class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          @for (img of images; track img; let i = $index) {
            <button
              type="button"
              (click)="goTo(i, $event)"
              class="h-1.5 rounded-full bg-white/60 transition-all duration-300"
              [class.w-4]="i === current()"
              [class.w-1.5]="i !== current()"
              [class.bg-white]="i === current()"
              [attr.aria-label]="'Image ' + (i + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `,
})
export class ImageCarousel implements OnInit, OnChanges, OnDestroy {
  @Input() images: string[] = [];
  @Input() alt = '';

  current = signal(0);
  private timer?: ReturnType<typeof setInterval>;
  private touchStartX = 0;

  ngOnInit(): void {
    this.restartAutoplay();
  }

  ngOnChanges(): void {
    if (this.current() >= this.images.length) this.current.set(0);
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    if (this.images.length > 1) {
      this.timer = setInterval(() => {
        this.current.set((this.current() + 1) % this.images.length);
      }, 3000);
    }
  }

  private stopAutoplay(): void {
    if (this.timer) clearInterval(this.timer);
  }

  next(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.current.set((this.current() + 1) % this.images.length);
    this.restartAutoplay();
  }

  prev(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.current.set((this.current() - 1 + this.images.length) % this.images.length);
    this.restartAutoplay();
  }

  goTo(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.current.set(index);
    this.restartAutoplay();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.images.length <= 1) return;
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) < 40) return;
    event.preventDefault();
    event.stopPropagation();
    if (deltaX < 0) {
      this.current.set((this.current() + 1) % this.images.length);
    } else {
      this.current.set((this.current() - 1 + this.images.length) % this.images.length);
    }
    this.restartAutoplay();
  }
}
