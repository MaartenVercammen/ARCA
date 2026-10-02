import { Component, computed, inject, input } from '@angular/core';
import { SlideInBaseComponent } from '../../../../components/slide-in-base.component/slide-in-base.component';
import { User } from '../../../../interfaces/user-management.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-update-role-slide-in',
  imports: [SlideInBaseComponent, MatCheckbox],
  templateUrl: './update-role-slide-in.html',
  styleUrl: './update-role-slide-in.scss',
})
export class UpdateRoleSlideIn extends SlideInBaseComponent {
  private readonly _authService = inject(AuthService);
  public readonly selectedUser = input<User | null>(null);
  public readonly activeRoles = computed(() => this.selectedUser()?.roles ?? []);
  public readonly activeUsersRoles = computed(() => this._authService.getRoles());

  constructor() {
    super();
  }
}
