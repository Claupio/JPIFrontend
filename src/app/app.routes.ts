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
    path: 'copisteria',
    loadChildren: () => import('@pages/copisteria/copisteria.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    loadChildren: () => import('@pages/admin/admin.routes').then(m => m.routes)
  },
  // {
  //   path: 'consumatore',
  //   canActivate: [consumatoreGuard]
  // }


];
