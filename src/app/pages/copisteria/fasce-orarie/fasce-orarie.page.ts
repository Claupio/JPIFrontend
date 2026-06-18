import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { CopisteriaService } from '@services/copisteria-service';

@Component({
  selector: 'app-fasce-orarie',
  templateUrl: './fasce-orarie.page.html',
  styleUrls: ['./fasce-orarie.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption]
})
export class FasceOrariePage implements OnInit {

  fasceOrarie: any[] = []; 

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private copisteriaService: CopisteriaService
  ) {}

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
        { name: 'inizio_fascia', type: 'time' },
        { name: 'fine_fascia', type: 'time' }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Salva',
          handler: (data) => {
            if (!data.inizio_fascia || !data.fine_fascia) {
              this.mostraToast('Entrambi i campi sono richiesti!');
              return false;
            }

            // Chiamata al Service
            this.copisteriaService.addFasciaOraria(data).subscribe({
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
    // Passiamo i due parametri separati al metodo del service
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
