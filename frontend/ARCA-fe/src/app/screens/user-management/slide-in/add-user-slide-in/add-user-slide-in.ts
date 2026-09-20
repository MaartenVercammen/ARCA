import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { SlideInBaseComponent } from '../../../../components/slide-in-base.component/slide-in-base.component';
import { ApiConnector } from '../../../../shared/connector/api.connector';
import { SlideInControllerService } from '../../../../services/slide-in-controller/slide-in-controller.service';

@Component({
  selector: 'app-add-user-slide-in',
  imports: [SlideInBaseComponent, FormField, MatButton, MatFormField, MatInput, MatLabel, MatError],
  templateUrl: './add-user-slide-in.html',
  styleUrl: './add-user-slide-in.scss',
})
export class AddUserSlideIn extends SlideInBaseComponent {
  private _api = inject(ApiConnector);
  private _addUserSlideInController = inject(SlideInControllerService);
  public readonly isSubmitting = signal(false);
  public readonly created = output<void>();

  readonly model = signal({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      houseNumber: '',
      city: '',
      zipCode: '',
      country: '',
    },
  });

  readonly form = form(this.model, (path) => {
    required(path.username);
    required(path.password);
    minLength(path.password, 8);
  });

  protected isVisible(field: { (): { touched(): boolean; dirty(): boolean } }): boolean {
    const state = field();
    return state.touched() || state.dirty();
  }

  protected hasError(
    field: { (): { errors(): readonly { kind: string }[] } },
    kind: string,
  ): boolean {
    return field()
      .errors()
      .some((error) => error.kind === kind);
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) return;
    if (this.form().invalid()) {
      this.form.username().markAsTouched();
      this.form.password().markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { username, password, email, phoneNumber, address } = this.model();
    const optionalAddress = Object.fromEntries(
      Object.entries(address).filter(([, value]) => value.trim().length > 0),
    );
    const payload = {
      username,
      password,
      ...(email ? { email } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
      ...(Object.keys(optionalAddress).length > 0 ? { address: optionalAddress } : {}),
    };

    this._api.post('/users', payload).subscribe({
      next: () => {
        this.created.emit();
        this._addUserSlideInController.notifySlideInSuccess();
        this.onClose();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
