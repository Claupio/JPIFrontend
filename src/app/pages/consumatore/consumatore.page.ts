import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonChip, IonLabel, IonCardContent, IonButton, IonIcon, IonCol, IonRow, IonGrid, IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, IonRippleEffect, IonCheckbox, IonSelect, IonSelectOption, IonButtons, IonAvatar, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  documentOutline, timeOutline, trashOutline, addOutline, printOutline, createOutline, closeOutline, closeCircleOutline, flagOutline
} from 'ionicons/icons';
import { CopisteriaService } from '@services/copisteria-service';
import { ConsumatoreService } from '@services/consumatore-service';
import { SelezionaCopisteriaComponent } from './seleziona-copisteria/seleziona-copisteria.component';
import { Copisteria } from '@models/copisteria'; 

@Component({
  selector: 'app-consumatore',
  templateUrl: './consumatore.page.html',
  styleUrls: ['./consumatore.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonCard, IonChip, IonLabel, IonCardContent, IonButton, IonIcon,
    IonCol, IonRow, IonGrid, IonFab, IonFabButton, IonInfiniteScroll,
    IonInfiniteScrollContent, IonRippleEffect, IonCheckbox, IonSelect, IonSelectOption, IonButtons, IonAvatar,
    IonCardHeader,
    IonCardTitle,
    SelezionaCopisteriaComponent
]
})

//se l'ordine è già in stampa non si può più modificare 


export class ConsumatorePage implements OnInit {

  ordiniRaw: any[] = [];          // Contiene tutti gli ordini presi dal DB
  ordiniVisualizzati: any[] = []; // Array filtrato e ordinato mostrato nell'HTML

  // Model per le Checkbox di filtro
  mostraInCorso: boolean = true;
  mostraPronti: boolean = true;
  mostraStorico: boolean = true;

  // Model per la card modifica ordini

  isLeaving = false;
  showNewComponent = false;

  // Model per l'ordinamento
  criterioOrdinamento: string = 'data-desc';

  // Stato del form "Nuovo Ordine": preventivo pronto (null finché il form
  // nel componente figlio non è completo, incluso il PDF, e /preventivo riesce)
  preventivoOrdine: {
    copisteria_id: number;
    formato_carta: string;
    metodo_di_stampa: string;
    add_on: string[];
    fascia: { copisteria_id: number; inizio_fascia: string; fine_fascia: string };
    file: File;
    prezzoStimato: number;
    tempo_massimo_ritiro: string;
  } | null = null;

  IDordineDaModificare: number | null = null;

  paginaCorrente = 1;

  constructor(
    private consumatoreService: ConsumatoreService, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ documentOutline, timeOutline, trashOutline, addOutline, printOutline, createOutline, closeOutline, closeCircleOutline, flagOutline });
  }

  ngOnInit() {
    this.caricaOrdiniConsumatore();
  }

  ionViewWillEnter() {
    this.caricaOrdiniConsumatore();
  }

  caricaOrdiniConsumatore(event?: any) {
    let mostra_stato = []
    let nascondi_stato = []

    if (this.mostraInCorso) {
      mostra_stato.push('EFFETTUATO', 'IN_STAMPA');
    } else {
      nascondi_stato.push('EFFETTUATO', 'IN_STAMPA');
    }

    if (this.mostraPronti) {
      mostra_stato.push('STAMPATO');
    } else {
      nascondi_stato.push('STAMPATO');
    }

    if (this.mostraStorico) {
      mostra_stato.push('CANCELLATO', 'CONSEGNATO');
    } else {
      nascondi_stato.push('CANCELLATO', 'CONSEGNATO');
    }

    const filtri = { stato: { eq: mostra_stato, ne: nascondi_stato } };
    
    this.consumatoreService.getOrdiniConsumatore(filtri).subscribe({
      next: (data: any[]) => {
        this.ordiniRaw = data;

        this.aggiornaVista();
        
        if (event) {
          event.target.complete();
        }
      },
      error: (err: any) => {
        console.error(err);
        if (event) event.target.complete();
      }
    });
  }

  // Funzione centrale che filtra e ordina l'array in base alle scelte utente
  aggiornaVista()
   {
    // let filtrati = this.ordiniRaw.filter((ordine: any) => {
    //   if (ordine.stato === 'EFFETTUATO' || ordine.stato === 'IN_STAMPA') {
    //     return this.mostraInCorso;
    //   }
    //   if (ordine.stato === 'STAMPATO') {
    //     return this.mostraPronti;
    //   }
    //   if (ordine.stato === 'CANCELLATO' || ordine.stato === 'CONSEGNATO') {
    //     return this.mostraStorico;
    //   }
    //   return true;
    // });

    // 2. ORDINAMENTO
    this.ordiniVisualizzati = this.ordiniRaw.sort((a: any, b: any) => {
      if (this.criterioOrdinamento === 'data-desc') {
        return new Date(b.tempo_minimo_ritiro).getTime() - new Date(a.tempo_minimo_ritiro).getTime();
      }
      if (this.criterioOrdinamento === 'data-asc') {
        return new Date(a.tempo_minimo_ritiro).getTime() - new Date(b.tempo_minimo_ritiro).getTime();
      }
      if (this.criterioOrdinamento === 'prezzo-desc') {
        return b.prezzo - a.prezzo;
      }
      if (this.criterioOrdinamento === 'prezzo-asc') {
        return a.prezzo - b.prezzo;
      }
      return 0;
    });
  }

  caricaAltriOrdini(event: any) {
    this.paginaCorrente++;
    this.caricaOrdiniConsumatore(event);
  }

  getEtichettaConsumatore(stato: string): string {
    switch(stato) {
      case 'EFFETTUATO': return 'In Attesa';
      case 'IN_STAMPA': return 'In Stampa';
      case 'STAMPATO': return 'Pronto al Ritiro';
      case 'CONSEGNATO': return 'Ritirato';
      case 'CANCELLATO': return 'Annullato';
      default: return stato;
    }
  }

  getColorStatoConsumatore(stato: string): string {
    switch(stato) {
      case 'EFFETTUATO': return 'warning';
      case 'IN_STAMPA': return 'primary';
      case 'STAMPATO': return 'success';
      case 'CONSEGNATO': return 'medium';
      case 'CANCELLATO': return 'danger';
      default: return 'dark';
    }
  }

  toggleOrderForm() {
    this.IDordineDaModificare = this.IDordineDaModificare == -1 ? null : -1;

    // Reset del form ogni volta che la card viene chiusa/riaperta
    if (this.IDordineDaModificare == null) {
      this.preventivoOrdine = null;
    }
  }

  toggleModifyOrder(ordineId: number) {
    this.isLeaving = true;

    setTimeout(() => {
      this.IDordineDaModificare = ordineId;
      this.isLeaving = false;
      this.showNewComponent = true;
    }, 400);
  }

  onPreventivoPronto(preventivo: typeof this.preventivoOrdine) {
    this.preventivoOrdine = preventivo;
  }

  segnalaCopisteria(copisteria_id: number) {
    const alert = this.alertCtrl.create({
      header: 'Segnala Copisteria',
      inputs: [
        {
          name: 'segnalazione',
          type: 'textarea',
          placeholder: 'Specifica il problema riscontrato...'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Invia Segnalazione',
          handler: (data) => {
            if (data.segnalazione && data.segnalazione.trim() !== '') {
              this.consumatoreService.segnalaCopisteria(copisteria_id, data.segnalazione).subscribe({
                next: (data) =>{
                  this.toastCtrl.create({
                    message: 'Copisteria Segnalata',
                    duration: 3000,
                    position: 'bottom',
                    color: 'success',
                    buttons: [{ text: 'OK', role: 'cancel' }]
                  }).then((toast) => (toast.present().then(() => {})));
                },
                error: (err) =>{
                  console.error('Errore nella segnalazione', err);
                  this.toastCtrl.create({
                    message: 'Errore nella segnalazione',
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger',
                    buttons: [{ text: 'OK', role: 'cancel' }]
                  }).then((toast) => (toast.present().then(() => {})));
                }
              })
            }
          }
        }
      ]
    }).then(a => a.present());
  }

  cambiaPassword() {
    const alert = this.alertCtrl.create({
      header: 'Cambia Password',
      inputs: [
        {
          name: 'vecchia_password',
          type: 'textarea',
          placeholder: 'Inserisci la tua password attuale'
        },
        {
          name: 'nuova_password',
          type: 'textarea',
          placeholder: 'Inserisci la tua nuova password'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Invia Segnalazione',
          handler: (data) => {
            if (data.segnalazione && data.segnalazione.trim() !== '') {
              this.consumatoreService.modificaPassword(data.vecchia_password, data.nuova_password).subscribe({
                next: (data) =>{
                  this.toastCtrl.create({
                    message: 'Password Cambiata correttamente',
                    duration: 3000,
                    position: 'bottom',
                    color: 'success',
                    buttons: [{ text: 'OK', role: 'cancel' }]
                  }).then((toast) => (toast.present()));
                },
                error: (err) =>{
                  console.error('Errore nella segnalazione', err);
                  this.toastCtrl.create({
                    message: 'Errore nella segnalazione',
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger',
                    buttons: [{ text: 'OK', role: 'cancel' }]
                  }).then((toast) => (toast.present()));
                }
              })
            }
          }
        }
      ]
    }).then(a => a.present());
  }

  puoInviareOrdine(): boolean {
    return !!this.preventivoOrdine;
  }

  apriNuovoOrdine() {
    if (!this.preventivoOrdine) {
      return;
    }

    // Multipart/form-data come richiesto da ordini.js: campo file "pdf" +
    // campi testo copisteria_id, formato_carta, metodo_di_stampa,
    // inizio_fascia, fine_fascia, add_on. Niente numero_pagine/prezzo:
    // li calcola il server dal PDF.
    const formData = new FormData();
    formData.append('pdf', this.preventivoOrdine.file, this.preventivoOrdine.file.name);
    formData.append('copisteria_id', String(this.preventivoOrdine.copisteria_id));
    formData.append('formato_carta', this.preventivoOrdine.formato_carta);
    formData.append('metodo_di_stampa', this.preventivoOrdine.metodo_di_stampa);
    formData.append('inizio_fascia', this.preventivoOrdine.fascia.inizio_fascia);
    formData.append('fine_fascia', this.preventivoOrdine.fascia.fine_fascia);
    formData.append('add_on',JSON.stringify(this.preventivoOrdine.add_on));

    this.consumatoreService.creaOrdine(formData).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: '🎉 Ordine inviato con successo alla copisteria!',
          duration: 3000,
          position: 'bottom',
          color: 'success',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => (toast.present().then(() => {
          this.toggleOrderForm();
          this.caricaOrdiniConsumatore();
        })));
      },
      error: (err: any) => {
        console.error(err);
        this.toastCtrl.create({
          message: 'Errore durante l\'invio dell\'ordine.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
      }
    });
  }

  modificaOrdine(ordine_id: number) {
        if (!this.preventivoOrdine) {
      return;
    }

    console.log(ordine_id);

    this.consumatoreService.modificaOrdine(this.preventivoOrdine.copisteria_id, ordine_id, this.preventivoOrdine.formato_carta, this.preventivoOrdine.metodo_di_stampa, this.preventivoOrdine.fascia.inizio_fascia, this.preventivoOrdine.fascia.fine_fascia, this.preventivoOrdine.add_on).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: '🎉 Ordine modificato con successo alla copisteria!',
          duration: 3000,
          position: 'bottom',
          color: 'success',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => (toast.present().then(() => {
          this.IDordineDaModificare = null;
          this.caricaOrdiniConsumatore();
        })));
      },
      error: (err: any) => {
        console.error(err);
        this.toastCtrl.create({
          message: 'Errore durante l\'invio dell\'ordine.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
      }
    });
  }

  cancellaOrdine(ordineId: number){
    this.consumatoreService.cancellaOrdine(ordineId).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: 'Ordine cancellato con successo.',
          duration: 3000,
          position: 'bottom',
          color: 'success',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
        this.caricaOrdiniConsumatore();
      },
      error: (err) => {
        console.error(err);
        this.toastCtrl.create({
          message: 'Errore durante la cancellazione dell\'ordine.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
      }
    });
    
  }

  eliminaOrdine(ordineId: number){
    this.consumatoreService.eliminaOrdine(ordineId).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: 'Ordine eliminato con successo.',
          duration: 3000,
          position: 'bottom',
          color: 'success',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
        this.ordiniVisualizzati = this.ordiniVisualizzati.filter(o => o.ordine_id !== ordineId)
        //this.caricaOrdiniConsumatore();
      },
      error: (err) => {
        console.error(err);
        this.toastCtrl.create({
          message: 'Errore durante la cancellazione dell\'ordine.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then((toast) => toast.present());
      }
    });
    
  }
}