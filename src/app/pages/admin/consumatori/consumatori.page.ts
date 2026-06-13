import { AdminService } from '@services/admin-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { Consumatore } from '@models/consumatore';

@Component({
  selector: 'app-consumatori',
  templateUrl: './consumatori.page.html',
  styleUrls: ['./consumatori.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class ConsumatoriPage implements OnInit {

  constructor(public adminService: AdminService, private alertController: AlertController) { }

  ngOnInit() {
    this.adminService.refreshConsumatori();
  }

  ionViewDidEnter() {
    this.adminService.refreshConsumatori();
  }

  async eliminaConsumatore(consumatore: Consumatore) {
    const alert = await this.alertController.create({
      header: 'Conferma Eliminazione',
      message: `Sei sicuro di voler eliminare il consumatore **${consumatore.email}**? Questa azione non è reversibile.`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminazione annullata');
          }
        },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.adminService.eliminaConsumatore(consumatore.consumatore_id).subscribe({
              error(err) {
                console.log(err)
              },
              next: (value) => {
              },
            })
          }
        }
      ]
    });

    await alert.present();
  }

}
