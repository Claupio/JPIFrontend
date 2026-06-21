import { Routes } from '@angular/router';
import { AdminPage } from './admin.page';
import { adminGuard } from 'src/app/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    component: AdminPage,
    children: [
      {
        path: 'consumatori',
        loadComponent: () => import('./consumatori/consumatori.page').then((m) => m.ConsumatoriPage),
      },
      {
        path: 'segnalazioni',
        loadComponent: () => import('./segnalazioni/segnalazioni.page').then((m) => m.SegnalazioniPage),
      },
       {
        path: 'copisterie',
        loadComponent: () => import('./copisterie/copisterie.page').then( m => m.CopisteriePage)
      },
      {
        path: '',
        redirectTo: 'copisterie',
        pathMatch: 'full',
      },
    ],
  },
  // {
  //   path: 'consumatori',
  //   loadComponent: () => import('./consumatori/consumatori.page').then( m => m.ConsumatoriPage)
  // },
  {
    path: 'copisterie/copisteria-form/:copisteria_id',
    loadComponent: () => import('./copisterie/copisteria-form/copisteria-form.page').then( m => m.CopisteriaFormPage)
  },

];
