import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,  IonCard, IonIcon, IonProgressBar } from '@ionic/angular/standalone';
import { CopisteriaService } from '@services/copisteria-service';
import localeIt from '@angular/common/locales/it';
import { statsChartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

registerLocaleData(localeIt);

@Component({
  selector: 'app-statistiche',
  templateUrl: './statistiche.page.html',
  styleUrls: ['./statistiche.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, 
     IonCard, IonIcon, IonProgressBar
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }]
})

export class ArchivioStatistichePage implements OnInit {
  
  statisticheOpzioni: any[] = [];

  constructor(private copisteriaService: CopisteriaService) {
    addIcons({ statsChartOutline });
  }

  ngOnInit() {
    this.caricaStatistiche();
  }

  ionViewWillEnter() {
   this.caricaStatistiche();
  }

  caricaStatistiche() {
    this.copisteriaService.getOrdiniMigliori().subscribe({
      next: (res) => {
        console.log(res)
        
        this.statisticheOpzioni = this.elaboraDatiGrafico(res);
      },
      error: (err) => console.error('Errore caricamento statistiche opzioni:', err)
    });
  }

  private elaboraDatiGrafico(dati: any[]): any[] {
    if (!dati || dati.length === 0) return [];

    const m = Math.max(...(dati.map(item => item.n)));

    return dati.map(item => ({
      etichetta: item.formato_carta + " - " + item.metodo_stampa,
      valore: item.n,
      percentualeBarra: item.n / m,
    })).sort((a, b) => b.valore - a.valore);
    
  }
}

