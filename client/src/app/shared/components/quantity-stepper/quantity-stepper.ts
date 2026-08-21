import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  template: `
    <div class="inline-flex items-center rounded-full border border-white/20 bg-white/5">
      <button
        type="button"
        (click)="dec()"
        [disabled]="value <= min"
        class="flex h-10 w-10 items-center justify-center text-lg text-white transition-colors hover:text-lime-400 disabled:opacity-30"
        aria-label="Diminuer la quantite"
        title="Diminuer la quantite"
      >
        &minus;
      </button>
      <span class="w-8 text-center font-semibold text-white">{{ value }}</span>
      <button
        type="button"
        (click)="inc()"
        class="flex h-10 w-10 items-center justify-center text-lg text-white transition-colors hover:text-lime-400"
        aria-label="Augmenter la quantite"
        title="Augmenter la quantite"
      >
        +
      </button>
    </div>
  `,
})
export class QuantityStepper {
  @Input() value = 1;
  @Input() min = 1;
  @Output() valueChange = new EventEmitter<number>();

  dec(): void {
    if (this.value > this.min) this.valueChange.emit(this.value - 1);
  }

  inc(): void {
    this.valueChange.emit(this.value + 1);
  }
}
