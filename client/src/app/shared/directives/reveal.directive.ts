import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

/**
 * Toggles a Tailwind `animate-*` class in when the host scrolls into view, instead of
 * playing the animation immediately on render. Disconnects after the first reveal.
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') animationClass = 'animate-fade-in-up';

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    // A bare `appReveal` attribute (no `[appReveal]="..."` binding) resolves the
    // @Input to an empty string, not the class default - fall back explicitly.
    const animationClass = this.animationClass || 'animate-fade-in-up';

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(element, animationClass);
      return;
    }

    this.renderer.addClass(element, 'opacity-0');
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.renderer.removeClass(element, 'opacity-0');
        this.renderer.addClass(element, animationClass);
        this.observer?.disconnect();
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
