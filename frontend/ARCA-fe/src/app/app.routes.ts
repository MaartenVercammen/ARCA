import { Routes } from '@angular/router';
import {AuthGuard} from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./screens/login/login').then(m => m.Login) },
  { path: 'home', loadComponent: () => import('./screens/home/home').then(m => m.Home), canActivate: [AuthGuard]}
];
