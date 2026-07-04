import { Component, OnInit, LOCALE_ID } from '@angular/core'; 
import { CommonModule, registerLocaleData } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonCard } from '@ionic/angular/standalone';
import { CopisteriaService } from '@services/copisteria-service';
import localeIt from '@angular/common/locales/it';
import { pencilSharp, trash,createOutline, hourglassOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

registerLocaleData(localeIt);

@Component({
  selector: 'app-fasce-orarie',
  templateUrl: './fasce-orarie.page.html',
  styleUrls: ['./fasce-orarie.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, IonButton, IonIcon, IonCard
  ],
  providers: [
    
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
})
export class FasceOrariePage implements OnInit {

  fasceOrarie: any[] = []; 

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private copisteriaService: CopisteriaService) {
    addIcons({ pencilSharp, trash, createOutline, hourglassOutline });
  }

  ngOnInit() {
    this.caricaFasceOrarie();
  }

  caricaFasceOrarie() {
    this.copisteriaService.getFasceOrarie().subscribe({
      next: (res) => {
        this.fasceOrarie = res;
      },
      error: (err) => {
        console.error(err);
        this.mostraToast('Errore nel caricamento delle fasce orarie');
      }
    });
  }

  async onAdd() { 
    const alert = await this.alertCtrl.create({
      header: 'Nuova Fascia Oraria',
      inputs: [
        { name: 'data_inizio', type: 'date' },
        { name: 'inizio_fascia', type: 'time' },
        { name: 'fine_fascia', type: 'time' }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Salva',
          handler: (data) => {
            if (!data.data_inizio || !data.inizio_fascia || !data.fine_fascia ) {
              this.mostraToast('Entrambi i campi sono richiesti!');
              return false;
            }

            const payload = {
              inizio_fascia: `${data.data_inizio}T${data.inizio_fascia}`,
              fine_fascia: `${data.data_inizio}T${data.fine_fascia}`
            };

            this.copisteriaService.addFasciaOraria(payload).subscribe({
              next: (res: any) => {
                this.mostraToast(res.message || 'Fascia aggiunta con successo');
                this.caricaFasceOrarie();
              },
              error: (err) => {
                this.mostraToast(err.error?.message || 'Errore durante il salvataggio');
              }
            });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async onDelete(item: any) {
    this.copisteriaService.deleteFasciaOraria(item.inizio_fascia, item.fine_fascia).subscribe({
      next: (res: any) => {
        this.mostraToast(res.message || 'Fascia rimossa con successo');
        this.caricaFasceOrarie();
      },
      error: (err) => {
        this.mostraToast(err.error?.message || 'Errore durante l\'eliminazione');
      }
    });
  }

  async mostraToast(messaggio: string) {
    const toast = await this.toastCtrl.create({
      message: messaggio,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}