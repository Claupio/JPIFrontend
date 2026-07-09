import { Component, OnInit, LOCALE_ID  } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonChip, IonLabel, IonCardContent, IonButton, IonIcon, IonCol, IonRow, IonGrid,IonSelect, IonSelectOption, IonButtons, IonAvatar, IonList, IonModal, IonPopover } from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { documentOutline, timeOutline, trashOutline, addOutline, printOutline, createOutline, closeOutline, closeCircleOutline, flagOutline, calendar, ellipsisVertical} from 'ionicons/icons';
import { ConsumatoreService } from '@services/consumatore-service';
import { CaratteristicheOrdineComponent } from './caratteristiche-ordine/caratteristiche-ordine.component';
import { FasciaOraria } from '@models/fascia_oraria';
import { Router } from '@angular/router';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

@Component({
  selector: 'app-consumatore',
  templateUrl: './consumatore.page.html',
  styleUrls: ['./consumatore.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonCard, IonChip, IonLabel, IonCardContent, IonButton, IonIcon,
    IonCol, IonRow, IonGrid, IonSelect, IonSelectOption, IonButtons, IonAvatar,
    CaratteristicheOrdineComponent, IonList, IonModal, IonPopover],
  providers: [
    
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
})


export class ConsumatorePage implements OnInit {

  ordiniRaw: any[] = [];          
  ordiniVisualizzati: any[] = []; 

  mostraInCorso: boolean = true;
  mostraPronti: boolean = true;
  mostraStorico: boolean = true;

  isLeaving = false;
  showNewComponent = false;

  criterioOrdinamento: string = 'data-desc';

  preventivoOrdine: {
    copisteria_id: number;
    formato_carta: string;
    metodo_di_stampa: string;
    add_on: string[];
    fascia: FasciaOraria;
    file: File;
    prezzoStimato: number;
    tempo_massimo_ritiro: string;
  } | null = null;

  IDordineDaModificare: number | null = null;

  paginaCorrente = 1;

  constructor(
    public consumatoreService: ConsumatoreService, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ documentOutline, timeOutline, trashOutline, addOutline, printOutline, createOutline, closeOutline, closeCircleOutline, flagOutline, calendar, ellipsisVertical });
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

  aggiornaVista()
   {
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

    if (this.IDordineDaModificare == null) {
      this.preventivoOrdine = null;
    }
  }

  logout() {
    this.consumatoreService.setToken('');
    this.router.navigate(["/"]);
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

  private async mostraToastSuccesso(testo: string) {
    const toast = await this.toastCtrl.create({
      message: testo,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  private async mostraToastFallimento(testo: string) {
    const toast = await this.toastCtrl.create({
      message: testo,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
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
                  this.mostraToastSuccesso('Copisteria Segnalata.')
                },
                error: (err) =>{
                  console.error('Errore nella segnalazione', err);
                  this.mostraToastFallimento('Errore nella segnalazione.')
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
          type: 'password',
          placeholder: 'Inserisci la tua password attuale'
        },
        {
          name: 'nuova_password',
          type: 'password',
          placeholder: 'Inserisci la tua nuova password'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Cambia Password',
          handler: (data) => {

            const test_password = (pwd: string) => pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd) && /[@$!%*?&]/.test(pwd);

            if (data.vecchia_password && data.vecchia_password.trim() !== '' && data.nuova_password && data.nuova_password.trim() !== '') {
              if(!test_password(data.nuova_password)) {
                this.mostraToastFallimento('Nuova password non sicura');
                return;
              }
              this.consumatoreService.modificaPassword(data.vecchia_password, data.nuova_password).subscribe({
                next: (data) =>{
                  this.mostraToastSuccesso('Password cambiata correttamente.');
                },
                error: (err) =>{
                  console.error('Errore nel cambio password', err);
                  this.mostraToastFallimento('Errore nel cambio password.');
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
        this.mostraToastSuccesso('Ordine inviato con successo alla copisteria.').then(() => {
          this.toggleOrderForm();
          this.caricaOrdiniConsumatore();
        });
      },
      error: (err: any) => {
        console.error(err);
        this.mostraToastFallimento('Errore durante l\'invio dell\'ordine.')
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
        this.mostraToastSuccesso('Ordine modificato con successo alla copisteria.').then(() => {
          this.IDordineDaModificare = null;
          this.caricaOrdiniConsumatore();
        });
      },
      error: (err: any) => {
        console.error(err);
        this.mostraToastFallimento('Errore durante l\'invio dell\'ordine.');
      }
    });
  }

  cancellaOrdine(ordineId: number){
    this.consumatoreService.cancellaOrdine(ordineId).subscribe({
      next: () => {
        this.mostraToastSuccesso('Ordine cancellato con successo.');
        this.caricaOrdiniConsumatore();
      },
      error: (err) => {
        console.error(err);
        this.mostraToastFallimento('Errore durante la cancellazione dell\'ordine.');
      }
    });
    
  }

  eliminaOrdine(ordineId: number){
    this.consumatoreService.eliminaOrdine(ordineId).subscribe({
      next: () => {
        this.mostraToastSuccesso('Ordine eliminato con successo.');
        this.ordiniVisualizzati = this.ordiniVisualizzati.filter(o => o.ordine_id !== ordineId)
      },
      error: (err) => {
        console.error(err);
        this.mostraToastFallimento('Errore durante l\'eliminazione dell\'ordine.')
      }
    });
  }

  fasceOrarieRitiroOrdine: FasciaOraria[] | null = null;

  visualizzaFasceOrarieCopisteria(copisteriaId: number, tempo_minimo_ritiro: string, tempo_massimo_ritiro: string) {
    this.consumatoreService.getFasceOrarie({
      copisteria_id: {eq: copisteriaId},
      inizio_fascia: {ge: tempo_minimo_ritiro},
      fine_fascia: {le: tempo_massimo_ritiro}
    }).subscribe({
      next: (value) => {
        this.fasceOrarieRitiroOrdine = value;
      },

      error: (err) => this.mostraToastFallimento('Errore reperimento fasce orarie.')
    })
  }
}