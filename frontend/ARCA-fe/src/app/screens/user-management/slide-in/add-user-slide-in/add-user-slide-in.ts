import { Component } from '@angular/core';
import { SlideInBaseComponent } from '../../../../components/slide-in-base.component/slide-in-base.component';

@Component({
  selector: 'app-add-user-slide-in',
  imports: [SlideInBaseComponent],
  templateUrl: './add-user-slide-in.html',
  styleUrl: './add-user-slide-in.scss',
})
export class AddUserSlideIn extends SlideInBaseComponent {}
