import { Routes } from '@angular/router';
import { CopisteriaPage } from './copisteria.page';

export const routes: Routes = [
  {
    path: '',
    component: CopisteriaPage,
    children: [
      {
        path: 'copisteria-ordini',
        loadComponent: () =>
          import('./copisteria-ordini/copisteria-ordini.page').then((m) => m.CopisteriaOrdiniPage),
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
        path: 'archivio-statistiche',
        loadComponent: () => import('./archivio-statistiche/archivio-statistiche.page').then( m => m.ArchivioStatistichePage)
      },
      {
        path: '',
        redirectTo: '/copisteria/copisteria-ordini',
        pathMatch: 'full',
      },
    ],
  },
];
