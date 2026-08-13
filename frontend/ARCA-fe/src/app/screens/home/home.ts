import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    MatButton
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  private _authService = inject(AuthService);
  private _router = inject(Router);

  public getName(): string | null {
    return this._authService.getName();
  }

  protected goToUsers() {
    void this._router.navigate(['/users']);
  }
}
