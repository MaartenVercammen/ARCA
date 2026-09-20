import { Component, inject, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  private _injector = inject(Injector);

  public users = toSignal(this._api.get<User[]>('/users'), { initialValue: [] });

  protected displayedColumns: string[] = ['username', 'address', 'email', 'phoneNumber'];

  protected readonly AddressPipe = AddressPipe;

  constructor() {
    this._slideInController.slideInSuccess$.subscribe(() => this.retryFetch());
  }

  protected retryFetch() {
    this.users = toSignal(this._api.get<User[]>('/users'), {
      initialValue: [],
      injector: this._injector,
    });
  }

  protected openAddUserSlideIn() {
    this._slideInController.openSlideIn(AddUserSlideIn);
  }
}
