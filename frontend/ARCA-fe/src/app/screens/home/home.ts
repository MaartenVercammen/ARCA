import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  private _authService = inject(AuthService);

  public getName(): string | null {
    return this._authService.getName();
  }

}
