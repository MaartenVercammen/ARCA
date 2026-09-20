import { Component, inject, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { ApiConnector } from '../../shared/connector/api.connector';
import { User } from '../../interfaces/user-management.interface';
import { AddressPipe } from '../../pipes/address-pipe';
import { EmptyStateComponent } from '../../components/empty-state.component/empty-state.component';
import { MatButton } from '@angular/material/button';
import { SlideInControllerService } from '../../services/slide-in-controller/slide-in-controller.service';
import { AddUserSlideIn } from './slide-in/add-user-slide-in/add-user-slide-in';

@Component({
  selector: 'app-user-management',
  imports: [
    AddressPipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    EmptyStateComponent,
    MatButton,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private _api = inject(ApiConnector);
  private _slideInController = inject(SlideInControllerService);
  protected readonly AddressPipe = AddressPipe;

  public users = signal<User[]>([]);
  public isLoading = signal(true);
  public hasError = signal(false);

  protected displayedColumns: string[] = ['username', 'address', 'email', 'phoneNumber', 'actions'];

  constructor() {
    this.loadUsers();
  }

  protected retryFetch() {
    this.loadUsers();
  }

  private loadUsers() {
    this.isLoading.set(true);
    this.hasError.set(false);

    this._api.get<User[]>('/users').subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      },
    });
  }

  protected openAddUserSlideIn() {
    this._slideInController.openSlideIn(AddUserSlideIn).subscribe(({ reason }) => {
      if (reason === 'success') {
        this.retryFetch();
      }
    });
  }

  protected openEditUserSlideIn(user: User) {
    this._slideInController
      .openSlideIn(AddUserSlideIn, { selectedUser: user })
      .subscribe(({ reason }) => {
        if (reason === 'success') {
          this.retryFetch();
        }
      });
  }
}
