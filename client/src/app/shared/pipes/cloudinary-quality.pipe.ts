import { Pipe, PipeTransform } from '@angular/core';
import { cloudinaryOptimize } from '../utils/cloudinary';

@Pipe({ name: 'cloudinaryQuality', standalone: true })
export class CloudinaryQualityPipe implements PipeTransform {
  transform(url: string | undefined | null, width: number): string {
    return cloudinaryOptimize(url, width);
  }
}
