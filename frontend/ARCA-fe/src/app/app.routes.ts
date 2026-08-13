import {Routes} from '@angular/router';
import {AuthGuard} from './guards/auth-guard';
import {RoleGuard} from './guards/role.guard';
import {ROLES} from './shared/constant/roles.const';

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', loadComponent: () => import('./screens/login/login').then(m => m.Login)},
  {path: 'home', loadComponent: () => import('./screens/home/home').then(m => m.Home), canActivate: [AuthGuard]},
  {
    path: 'users',
    loadComponent: () => import('./screens/user-management/user-management').then(m => m.UserManagement),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: ROLES.USER
    }
  },
  {path: '**', redirectTo: '/login'}
];
