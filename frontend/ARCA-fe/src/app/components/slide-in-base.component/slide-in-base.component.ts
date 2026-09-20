import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { SlideInControllerService } from '../../services/slide-in-controller/slide-in-controller.service';

@Component({
  selector: 'app-slide-in-base',
  imports: [MatIconButton, MatIcon],
  templateUrl: './slide-in-base.component.html',
  styleUrl: './slide-in-base.component.scss',
})
export class SlideInBaseComponent {
  private _slideInController = inject(SlideInControllerService);

  public title = input.required<string>();

  public onClose() {
    this._slideInController.closeSlideIn();
  }
}
