import { Routes } from '@angular/router';
import { CopisteriaPage } from './copisteria.page';
import { copisteriaGuard } from 'src/app/guards/copisteria-guard';

export const routes: Routes = [
  {
    path: '',
    component: CopisteriaPage,
    canActivate: [copisteriaGuard],
    children: [
      {
        path: 'ordini',
        loadComponent: () =>
          import('./ordini/ordini.page').then((m) => m.CopisteriaOrdiniPage),
      },
      {
        path: 'fasce-orarie',
        loadComponent: () => import('./fasce-orarie/fasce-orarie.page').then((m) => m.FasceOrariePage),
      },
       {
        path: 'configurazioni',
        loadComponent: () => import('./configurazioni/configurazioni.page').then( m => m.ConfigurazioniPage)
      },
      {
        path: 'statistiche',
        loadComponent: () => import('./statistiche/statistiche.page').then( m => m.ArchivioStatistichePage)
      },
      {
        path: '',
        redirectTo: 'ordini',
        pathMatch: 'full',
      },
    ],
  },
];
