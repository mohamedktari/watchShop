import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Subtle magnetic pull toward the cursor on hover, desktop only. Capped so the
 * element never visibly "chases" the pointer - see MASTER PROMPT step 18.
 */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective {
  private el = inject(ElementRef<HTMLElement>);
  private readonly strength = 0.25;
  private readonly maxOffset = 8;

  constructor() {
    this.el.nativeElement.style.transition = 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const tx = Math.max(-this.maxOffset, Math.min(this.maxOffset, x * this.strength));
    const ty = Math.max(-this.maxOffset, Math.min(this.maxOffset, y * this.strength));
    this.el.nativeElement.style.transform = `translate(${tx}px, ${ty}px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform = '';
  }
}
