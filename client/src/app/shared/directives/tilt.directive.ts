import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Subtle cursor-based 3D tilt (max ~3deg) for a hero/featured product, desktop only.
 * See MASTER PROMPT step 17 - intentionally NOT applied to every card.
 */
@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective {
  private el = inject(ElementRef<HTMLElement>);
  private readonly maxTilt = 3;

  constructor() {
    this.el.nativeElement.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const rx = (-py * this.maxTilt).toFixed(2);
    const ry = (px * this.maxTilt).toFixed(2);
    this.el.nativeElement.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform = '';
  }
}
