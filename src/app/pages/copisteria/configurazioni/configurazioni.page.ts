import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSegment, IonSegmentButton, IonLabel, IonButton, IonCard, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {AlertController,ToastController} from '@ionic/angular';
import { pencilSharp, trash, documentOutline, printOutline, starOutline, addOutline,createOutline } from 'ionicons/icons';
import { CopisteriaService } from '@services/copisteria-service';


@Component({
  selector: 'app-configurazioni',
  templateUrl: './configurazioni.page.html',
  styleUrls: ['./configurazioni.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonSegment, IonSegmentButton, IonLabel, IonButton, IonCard, IonIcon]
})
export class ConfigurazioniPage implements OnInit {

  selectedTab = 'paper';

  opzioniOrdini: any = {
    prezzi_formati_carta: {}, prezzi_metodi_stampa: {}, prezzi_add_on: {}, numero_giorni_conservazione: 0
  }



  constructor(private copisteriaService: CopisteriaService, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    addIcons({ pencilSharp, trash, documentOutline,printOutline, starOutline, addOutline, createOutline });
  }

  ngOnInit() {
    this.caricaDati();
  }

  caricaDati(){
    this.copisteriaService.getOpzioniOrdini().subscribe({
      next: (data) => {
        console.log(data);
        this.opzioniOrdini = data;
      },
      error: (err) =>{
        console.error("Errore nel recupero degli ordini", err);
        this.mostraToast('Impossibile caricare le opzioni ordini dal server.');
      }
    })
  }

  salvaConfigurazioni() {
  
  this.opzioniOrdini.prezzi_formati_carta = { ...this.opzioniOrdini.prezzi_formati_carta };
  this.opzioniOrdini.prezzi_metodi_stampa = { ...this.opzioniOrdini.prezzi_metodi_stampa };
  this.opzioniOrdini.prezzi_add_on = { ...this.opzioniOrdini.prezzi_add_on };

  this.copisteriaService.setOpzioniOrdini(this.opzioniOrdini).subscribe({
    next: () => this.mostraToast('Configurazioni salvate con successo!'),
    error: () => this.mostraToast('Errore nel salvataggio')
  });
}

  async mostraToast(msg: string){
    const toast = await this.toastCtrl.create({message: msg, duration: 2000});
    toast.present();
  }

  async onAdd() {
    if (this.selectedTab === 'paper') {
      const alert = await this.alertCtrl.create({
        header: 'Nuovo Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (es. A4)' },
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 }
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              this.opzioniOrdini.prezzi_formati_carta[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }

    if (this.selectedTab === 'print') {
      const alert = await this.alertCtrl.create({
        header: 'Nuovo Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (Stampa Colori)' },
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 }
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              this.opzioniOrdini.prezzi_metodi_stampa[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }

    if(this.selectedTab === 'addons'){
      const alert = await this.alertCtrl.create({
        header: 'Nuovo Addons',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (Rilegatura  a Spirale)' },
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 }
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              this.opzioniOrdini.prezzi_add_on[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async onDelete(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma Eliminazione',
      message: `Sei sicuro di voler eliminare "${item.name}"?`,
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            if (this.selectedTab === 'paper') {
              delete this.opzioniOrdini.prezzi_formati_carta[item.key];
              this.salvaConfigurazioni();
            }
            if (this.selectedTab === 'print') {
              delete this.opzioniOrdini.prezzi_metodi_stampa[item.key];
              this.salvaConfigurazioni();
            }
            if (this.selectedTab === 'addons') {
              delete this.opzioniOrdini.prezzi_add_on[item.key];
              this.salvaConfigurazioni();  
            }
          }
        }
      ]
    });
    await alert.present();
  }

  
  async onEdit(item: any) {
     if (this.selectedTab === 'paper') {
      const alert = await this.alertCtrl.create({
        header: 'Modifica Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (es. A4)',value: item.name},
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 ,value: item.price}
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              if (data.name !== item.name) {
              delete this.opzioniOrdini.prezzi_formati_carta[item.name];
              }
              
              this.opzioniOrdini.prezzi_formati_carta[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }
    if (this.selectedTab === 'print') {
      const alert = await this.alertCtrl.create({
        header: 'Modifica Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (Stampa Colori)',value: item.name},
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 ,value: item.price}
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              if (data.name !== item.name) {
              delete this.opzioniOrdini.prezzi_metodi_stampa[item.name];
              }
              
              this.opzioniOrdini.prezzi_metodi_stampa[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }
    if (this.selectedTab === 'addons') {
      const alert = await this.alertCtrl.create({
        header: 'Modifica Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (Rilegatura  a Spirale)',value: item.name},
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 ,value: item.price}
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              if (data.name !== item.name) {
              delete this.opzioniOrdini.prezzi_add_on[item.name];
              }
              
              this.opzioniOrdini.prezzi_add_on[data.name] = data.price;
              this.salvaConfigurazioni();
              console.log(this.opzioniOrdini)
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async onGmr() {
  const alert = await this.alertCtrl.create({
    header: 'Aggiungi Giorni Max Ritiro',
    inputs: [
      {
        name: 'giorni',
        type: 'number',
        placeholder: 'Inserisci i giorni (es. 7)',
        min: 0,
      
        value: this.opzioniOrdini.numero_giorni_conservazione,
      }
    ],
    buttons: [
      { text: 'Annulla', role: 'cancel' },
      {
        text: 'Salva',
        handler: (data) => {
          this.opzioniOrdini.numero_giorni_conservazione = data.giorni;
          this.salvaConfigurazioni();
          console.log(this.opzioniOrdini);
        }
      }
    ]
  });
  await alert.present();
}
}



