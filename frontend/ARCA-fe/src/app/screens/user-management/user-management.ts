import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {User, UserManagementService} from '../../services/user-management.service';
import {BehaviorSubject} from 'rxjs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

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
export class UserManagement implements OnInit{

  private _userManagementService = inject(UserManagementService)

  public users = computed(() => this._userManagementService.users())

  public emptyState = signal(true)
  protected displayedColumns: string[] = ['username']

  public ngOnInit(): void {
    this._userManagementService.fetchUsers().then((loaded) =>
      {
        if(!loaded){
          this.emptyState.set(true)
        }
        else{
          this.emptyState.set(false)
        }
      }
    );
  }

}
