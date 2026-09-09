import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
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
  MatTable
} from '@angular/material/table';
import {ApiConnector} from '../../shared/connector/api.connector';
import {User} from '../../interfaces/user-management.interface';

@Component({
  selector: 'app-user-management',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {

  private _api = inject(ApiConnector)

  public users = toSignal(this._api.get<User[]>('/users'), {initialValue: []});

  protected displayedColumns: string[] = ['username']


}
