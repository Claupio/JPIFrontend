import { Routes } from '@angular/router';
import { consumatoreGuard } from './guards/consumatore-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    loadComponent: () => import('@pages/homepage/homepage.page').then( m => m.HomepagePage),
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadComponent: () => import('@pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'consumatore',
    canActivate: [consumatoreGuard],
    loadComponent: () => import('@pages/consumatore/consumatore.page').then(m => m.ConsumatorePage)
  },
  { 
    path: 'copisteria',
    loadChildren: () => import('@pages/copisteria/copisteria.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    loadChildren: () => import('@pages/admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'verifica-email/:token',
    loadComponent: () => import('./pages/verifica-email/verifica-email.page').then( m => m.VerificaEmailPage)
  },
  {
    path: 'modifica-password-da-email/:token',
    loadComponent: () => import('./pages/modifica-password-da-email/modifica-password-da-email.page').then( m => m.ModificaPasswordDaEmailPage)
  },
  {
    path: 'recupera-password',
    loadComponent: () => import('./pages/recupera-password/recupera-password.page').then( m => m.RecuperaPasswordPage)
  },
  {
    path: 'easter-egg',
    loadComponent: () => import('./pages/easter-egg/easter-egg.page').then( m => m.EasterEggPage)
  },



  // {
  //   path: 'consumatore',
  //   canActivate: [consumatoreGuard]
  // }


];
