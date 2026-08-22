import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:top-6">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-2xl backdrop-blur-md"
          [class.bg-brand-900/90]="t.type !== 'error'"
          [class.bg-red-600/90]="t.type === 'error'"
          [class.animate-toast-in]="!t.leaving"
          [class.animate-toast-out]="t.leaving"
        >
          @if (t.type === 'success') {
            <span class="text-lime-400">&#10003;</span>
          } @else if (t.type === 'error') {
            <span>&#9888;</span>
          }
          {{ t.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  toast = inject(ToastService);
}
