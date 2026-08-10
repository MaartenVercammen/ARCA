import {Component, effect, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
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

  public login(data: Partial<{
  email: string | null;
  password: string | null;
}>): void {
    const username = data.email;
    const password = data.password;
    console.log(username, password);
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
