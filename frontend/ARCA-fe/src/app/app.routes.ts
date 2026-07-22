import { Routes } from '@angular/router';
import {AuthGuard} from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home), canActivate: [AuthGuard]}
];
