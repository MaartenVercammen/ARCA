import { Component, computed, inject, input, signal } from '@angular/core';
import { SlideInBaseComponent } from '../../../../components/slide-in-base.component/slide-in-base.component';
import { User } from '../../../../interfaces/user-management.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { AuthService } from '../../../../services/auth/auth.service';
import { ApiConnector } from '../../../../shared/connector/api.connector';
import { MatButton } from '@angular/material/button';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-update-role-slide-in',
  imports: [SlideInBaseComponent, MatCheckbox, MatButton],
  templateUrl: './update-role-slide-in.html',
  styleUrl: './update-role-slide-in.scss',
})
export class UpdateRoleSlideIn extends SlideInBaseComponent {
  private readonly _authService = inject(AuthService);
  private readonly _apiService = inject(ApiConnector);

  public readonly selectedUser = input<User | null>(null);
  public readonly activeRoles = computed(() => this.selectedUser()?.roles ?? []);
  public activeUsersRoles = signal(this._authService.getRoles());

  constructor() {
    super();
    if (this._authService.isAdmin()) {
      this._apiService.get<string[]>('/users/roles').subscribe((roles: string[]) => {
        this.activeUsersRoles.set(roles);
      });
    }
  }

  protected readonly form = form;
}
