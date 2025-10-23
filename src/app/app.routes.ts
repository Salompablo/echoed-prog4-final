import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
