import { AdminService } from '@services/admin-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, AlertController, IonCard } from '@ionic/angular/standalone';
import { Consumatore } from '@models/consumatore';
import { addIcons } from 'ionicons';
import { pencilSharp, trash} from 'ionicons/icons';

@Component({
  selector: 'app-consumatori',
  templateUrl: './consumatori.page.html',
  styleUrls: ['./consumatori.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonIcon, IonCard]
})
export class ConsumatoriPage implements OnInit {

  constructor(public adminService: AdminService, private alertController: AlertController) { 
    addIcons({ pencilSharp, trash});
  }

  ngOnInit() {
    this.adminService.refreshConsumatori();
  }

  ionViewDidEnter() {
    this.adminService.refreshConsumatori();
  }

  async eliminaConsumatore(consumatore: Consumatore) {
    const alert = await this.alertController.create({
    header: 'Cancella Consumatore: ' + consumatore.email,
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
            this.adminService.eliminaConsumatore(consumatore.consumatore_id, data.motivazione).subscribe({
              error(err) {
                console.log(err)
              },
              next: (value) => {
              },
            })
            return true; 
          } else {
            
            console.log('Motivazione obbligatoria');
            return false; 
          }
        }
      }
    ]
  });

    await alert.present();
  }

}
