import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SystemMessageConfig } from '../../system-message.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [MatIconButton, MatIcon],
  templateUrl: './system-message.component.html',
  styleUrl: './system-message.component.scss',
})
export class SystemMessageComponent {
  data = inject<SystemMessageConfig>(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);

  protected get durationStyle(): string | null {
    return this.data.duration ? `${this.data.duration}ms` : null;
  }

  protected get title(): string {
    return this.data.message;
  }

  protected get icon(): string {
    return {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    }[this.data.type];
  }

  protected onClose() {
    this.snackBarRef.dismiss();
  }
}
