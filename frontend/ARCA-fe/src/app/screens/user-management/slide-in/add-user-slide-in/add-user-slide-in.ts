import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SlideInControllerService } from '../../../../services/slide-in-controller/slide-in-controller.service';

@Component({
  selector: 'app-add-user-slide-in',
  imports: [MatButton],
  templateUrl: './add-user-slide-in.html',
  styleUrl: './add-user-slide-in.scss',
})
export class AddUserSlideIn {
  private _slideInController = inject(SlideInControllerService);

  public onClose() {
    this._slideInController.closeSlideIn();
  }
}
