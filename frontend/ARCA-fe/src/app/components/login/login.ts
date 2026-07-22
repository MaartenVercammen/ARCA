import {Component, effect, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private loginService = inject(AuthService);
  private _router = inject(Router);

  constructor() {
    this.loginService.logout()
  }

  public form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
  });

  public login(): void {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;
    if (username && password) {
      this.loginService.login(username, password)
        .catch((error) => {
          console.log('error')
          throw error
        })
        .then(() => void this._router.navigate(['/home']));
    }
  }
}
