import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetaPixelService } from './core/services/meta-pixel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  // Injecting (rather than just importing) instantiates the service, which wires
  // up its router-navigation subscription in the constructor - see the service
  // for why this is needed on top of the pixel snippet in index.html.
  private metaPixel = inject(MetaPixelService);
}
