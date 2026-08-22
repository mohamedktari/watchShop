import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'splitWords', standalone: true })
export class SplitWordsPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    return (value ?? '').split(' ').filter(Boolean);
  }
}
