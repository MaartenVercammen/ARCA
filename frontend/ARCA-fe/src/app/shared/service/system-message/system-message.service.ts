import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SystemMessageComponent } from './component/system-message.component/system-message.component';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export type SystemMessageConfig = {
  message: string;
  type: MessageType;
  duration?: number;
};

@Injectable({
  providedIn: 'root',
})
export class SystemMessageService {
  private _snackBar = inject(MatSnackBar);

  show(message: SystemMessageConfig) {
    this._snackBar.openFromComponent(SystemMessageComponent, {
      data: message,
      duration: message.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['system-message-panel'],
    });
  }
}
