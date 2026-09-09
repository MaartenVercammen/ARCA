import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatIcon,
    MatCardActions,
    MatButton,
    MatIconButton,
    MatInput,
    MatCardContent,
    MatCard,
    NgOptimizedImage,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected loginService = inject(AuthService);
  private _router = inject(Router);
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  protected hidePassword = signal(true);

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) return;

    const username = this.form.value.username;
    const password = this.form.value.password;
    const success = await this.loginService.login(username!, password!);

    if (success) {
      await this._router.navigate(['/home']);
    }
  }

  constructor() {
    this.loginService.logout();
  }

  protected hasActiveRefreshToken(): boolean {
    return this.loginService.getRefreshToken() != null;
  }

  protected async refreshToken(): Promise<void> {
    if (await this.loginService.refreshToken()) {
      await this._router.navigate(['/home']);
    }
  }
}
