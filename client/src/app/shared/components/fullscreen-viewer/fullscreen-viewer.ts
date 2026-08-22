import { Component, HostListener, inject, signal } from '@angular/core';
import { FullscreenViewerService } from '../../../core/services/fullscreen-viewer.service';
import { CloudinaryQualityPipe } from '../../pipes/cloudinary-quality.pipe';

@Component({
  selector: 'app-fullscreen-viewer',
  standalone: true,
  imports: [CloudinaryQualityPipe],
  templateUrl: './fullscreen-viewer.html',
})
export class FullscreenViewer {
  viewer = inject(FullscreenViewerService);
  zoomed = signal(false);

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.viewer.images()) return;
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowRight') this.viewer.next();
    else if (event.key === 'ArrowLeft') this.viewer.prev();
  }

  close(): void {
    this.zoomed.set(false);
    this.viewer.close();
  }

  toggleZoom(event: Event): void {
    event.stopPropagation();
    this.zoomed.set(!this.zoomed());
  }

  stop(event: Event): void {
    event.stopPropagation();
  }
}
