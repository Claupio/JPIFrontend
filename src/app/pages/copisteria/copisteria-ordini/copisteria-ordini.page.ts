import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonInput, IonCol, IonRow, IonGrid, IonPopover, IonButtons, IonDatetime } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {  documentTextOutline,
  printOutline,
  pricetagOutline,
  timeOutline,
  calendarOutline,
  refreshOutline,
  trashOutline,
  documentOutline,
  sparklesOutline,
  ellipse
} from 'ionicons/icons';
import { CopisteriaService } from '@services/copisteria-service';



@Component({
  selector: 'app-copisteria-ordini',
  templateUrl: './copisteria-ordini.page.html',
  styleUrls: ['./copisteria-ordini.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonSelect, IonSelectOption, IonCard, IonChip, IonLabel, IonCardContent, IonButton, IonIcon, IonCol, IonRow, IonGrid, IonPopover, IonButtons, IonDatetime]

})

export class CopisteriaOrdiniPage implements OnInit {

  ordini: any[] = [];

  filtri: any = {stato: {eq: [], ne: []}, tempo_minimo_ritiro: { le: null, ge: null}};
  toastController: any;




  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private copisteriaService: CopisteriaService, private route: ActivatedRoute) {
    addIcons({  documentTextOutline,
  printOutline,
  pricetagOutline,
  documentOutline,
  timeOutline,
  calendarOutline,
  refreshOutline,
  trashOutline,
  sparklesOutline,
  ellipse });
  }

  ngOnInit(): void {

  }

 ionViewWillEnter() {
      this.caricaOrdiniDalDB();
  }


  onInclusionChange() {
  this.caricaOrdiniDalDB();
}


onExclusionChange() {
  this.caricaOrdiniDalDB();
}

caricaOrdiniDalDB(){
  this.copisteriaService.getOrdini(this.filtri).subscribe({
    next: (data) =>{
      console.log(data)
      this.ordini = data;
    },
    error: (err) =>{
      console.error('Errore nel recupero degli ordini', err);
      this.mostraToast('Impossibile caricare gli ordini dal server.');
    }
  })
}

scaricaPDF(ordine_id: number){

  this.copisteriaService.scaricaOrdinePDF(ordine_id).subscribe({
    next: (data) =>{
      console.log(data)
      const blobUrl = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement('a');
      link.href=blobUrl;
      link.download= `Ordine:${ordine_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      console.log('Download completato con successo!');
    },
    error: (err) =>{
      console.error('Errore durante il download del file', err);
      this.mostraToast('Impossibile scaricare il file!.');
    }
  })
}


  getColorStato(stato: string) {
    switch(stato.toUpperCase()) {
      case 'EFFETTUATO': return 'primary';
      case 'IN_STAMPA': return 'warning';
      case 'PRONTO': case 'STAMPATO': return 'secondary';
      case 'CONSEGNATO': return 'success';
      default: return 'dark';
    }
  }

  async apriPopupCancellazione(ordine: any) {
  const alert = await this.alertCtrl.create({
    header: 'Cancella Ordine #' + ordine.ordine_id,
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
            this.copisteriaService.cancellaOrdine(ordine.ordine_id, data.motivazione).subscribe({
              next: (data) =>{
                this.caricaOrdiniDalDB();
              },
              error: (err) =>{
                console.error('Errore nella cancellazione', err);
                this.mostraToast('Errore nella cancellazione');
              }
            })
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
    //this.ordiniFiltrati = [...this.ordini];
    this.mostraToast('Ordine cancellato e cliente notificato.');
  }


  scaricaPdf(ordine: any) {
    console.log('Download PDF per ordine:', ordine.id);
  }

  async mostraToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
  const toast = await this.toastCtrl.create({
    message: message,
    duration: 3000,          // Sparisce da solo dopo 3 secondi
    position: 'bottom',      // Puoi usare 'top', 'middle', 'bottom'
    color: color,           
    buttons: [{ text: 'OK', role: 'cancel' }] // Permette di chiuderlo prima
  });
  await toast.present();
}

  cambiaStato(ordine: any, vecchioStato:'EFFETTUATO' | 'IN_STAMPA' | 'STAMPATO') {
    const nextStato = {
      EFFETTUATO: "IN_STAMPA",
      IN_STAMPA: "STAMPATO",
      STAMPATO: "CONSEGNATO"
    }as const;

    this.copisteriaService.cambiaStato(ordine.ordine_id, nextStato[vecchioStato]).subscribe({
        error: (err) => {
          this.presentToast("fallito","danger");
          console.log(err)
        },
        next: (value) => {
          this.caricaOrdiniDalDB();
        },
        complete: () => {

        }

      })
  }
}

