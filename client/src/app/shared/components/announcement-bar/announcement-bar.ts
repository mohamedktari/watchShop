import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './announcement-bar.html',
})
export class AnnouncementBar {}
