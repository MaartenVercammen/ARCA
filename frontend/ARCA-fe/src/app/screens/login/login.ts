import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';

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
    MatInput,
    MatCardContent,
    MatCard,
    NgOptimizedImage,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private loginService = inject(AuthService);
  private _router = inject(Router);
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.min(8)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.value.username;
      const password = this.form.value.password;
      this.loginService.login(username!, password!)
        .catch((error) => {
          console.log('error')
          throw error
        })
        .then(() => void this._router.navigate(['/home']));
    }
  }

  constructor() {
    this.loginService.logout()
  }
}
