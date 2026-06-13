import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-copisteria-ordini',
  templateUrl: './copisteria-ordini.page.html',
  styleUrls: ['./copisteria-ordini.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonList, IonCard, IonCardHeader, IonChip, IonCardTitle, IonLabel, IonCardSubtitle, IonCardContent, IonButton, IonIcon]

})

export class CopisteriaOrdiniPage implements OnInit {

  ngOnInit() {
  }

  ordini = [
    { id: 101, consumatore: 'Mario Rossi', fasciaOraria: '08:00-13:00', stato: 'Ricevuto', descrizione: 'Tesi 200 pag A4' },
    { id: 102, consumatore: 'Anna Bianchi', fasciaOraria: '15:00-18:00', stato: 'In Stampa', descrizione: 'Dispense 50 pag A4' },
    { id: 103, consumatore: 'Luca Verdi', fasciaOraria: '08:00-13:00', stato: 'Stampato', descrizione: 'Locandine A3' },
  ];

  ordiniFiltrati = [...this.ordini];

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {}

  filtraOrdini(event: any) {
    const fascia = event.detail.value;
    if (fascia === 'all') {
      this.ordiniFiltrati = this.ordini;
    } else {
      this.ordiniFiltrati = this.ordini.filter(o => o.fasciaOraria === fascia);
    }
  }

  getColorStato(stato: string) {
    switch(stato) {
      case 'Ricevuto': return 'medium';
      case 'In Stampa': return 'warning';
      case 'Stampato': return 'secondary';
      case 'Consegnato': return 'success';
      default: return 'dark';
    }
  }

  async apriPopupCancellazione(ordine: any) {
  const alert = await this.alertCtrl.create({
    header: 'Cancella Ordine #' + ordine.id,
    inputs: [
      {
        name: 'motivazione',
        type: 'textarea',
        placeholder: 'Specifica la motivazione per il cliente...'
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Invia Mail e Cancella',
        handler: (data) => {
          if (data.motivazione && data.motivazione.trim() !== '') {
            this.eseguiCancellazione(ordine, data.motivazione);
            return true; // Chiude l'alert perché l'operazione è riuscita
          } else {
            // Qui potresti aggiungere un piccolo feedback visivo se vuoi
            console.log('Motivazione obbligatoria');
            return false; // Impedisce la chiusura dell'alert se il campo è vuoto
          }
        }
      }
    ]
  });
  await alert.present();
}

  eseguiCancellazione(ordine: any, motivo: string) {
    // Logica backend qui (invio mail e delete)
    this.ordini = this.ordini.filter(o => o.id !== ordine.id);
    this.ordiniFiltrati = [...this.ordini];
    this.mostraToast('Ordine cancellato e cliente notificato.');
  }

  cambiaStato(ordine: any, nuovoStato: string) {
    ordine.stato = nuovoStato;
    this.mostraToast(`Ordine #${ordine.id} aggiornato a: ${nuovoStato}`);
  }

  scaricaPdf(ordine: any) {
    console.log('Download PDF per ordine:', ordine.id);
  }

  async mostraToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}

