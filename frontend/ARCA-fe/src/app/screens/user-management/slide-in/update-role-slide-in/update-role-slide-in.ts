import { Component, effect, inject, input, output, signal } from '@angular/core';
import { SlideInBaseComponent } from '../../../../components/slide-in-base.component/slide-in-base.component';
import { User } from '../../../../interfaces/user-management.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { AuthService } from '../../../../services/auth/auth.service';
import { ApiConnector } from '../../../../shared/connector/api.connector';
import { MatButton } from '@angular/material/button';

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
  public readonly updated = output<void>();
  public activeUsersRoles = signal(this._authService.getRoles());
  public selectedRoles = signal<string[]>([]);
  public readonly isSubmitting = signal(false);

  constructor() {
    super();
    if (this._authService.isAdmin()) {
      this._apiService.get<string[]>('/users/roles').subscribe((roles: string[]) => {
        this.activeUsersRoles.set(roles);
      });
    }

    effect(() => {
      const user = this.selectedUser();
      this.selectedRoles.set(user?.roles ? [...user.roles] : []);
    });
  }

  public isRoleSelected(role: string): boolean {
    return this.selectedRoles().includes(role);
  }

  public onRoleChange(role: string, checked: boolean): void {
    const current = this.selectedRoles();
    if (checked) {
      if (!current.includes(role)) {
        this.selectedRoles.set([...current, role]);
      }
    } else {
      this.selectedRoles.set(current.filter((r) => r !== role));
    }
  }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const user = this.selectedUser();
    if (!user || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const payload = { roles: this.selectedRoles() };

    this._apiService.put<{ roles: string[] }, void>(`/users/${user.id}/roles`, payload).subscribe({
      next: () => {
        this.updated.emit();
        this._slideInController.notifySlideInSuccess();
        this.onClose();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
