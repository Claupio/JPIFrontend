import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonButton, IonCard, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {AlertController,ToastController} from '@ionic/angular';
import { pencilSharp, trash, documentOutline, printOutline, starOutline, addOutline } from 'ionicons/icons';
import { CopisteriaService } from '@services/copisteria-service';

@Component({
  selector: 'app-configurazioni',
  templateUrl: './configurazioni.page.html',
  styleUrls: ['./configurazioni.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSegment, IonSegmentButton, IonLabel, IonButton, IonCard, IonIcon]
})
export class ConfigurazioniPage implements OnInit {

  selectedTab = 'paper';
  paperFormats: any[] = [];
  printMethods: any[] = [];
  addons: any[] = [];
  giorniConservazione: number = 30;



  constructor(private copisteriaService: CopisteriaService, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    // Registrazione centralizzata delle icone
    addIcons({ pencilSharp, trash, documentOutline,printOutline, starOutline, addOutline });
  }

  ngOnInit() {
    this.caricaDati();
  }

  caricaDati(){
    this.copisteriaService.getOpzioniOrdini().subscribe({
      next: (data) => {
        console.log(data);
        this.paperFormats = data.prezzi_formati_carta;
        this.printMethods = data.prezzi_metodi_stampa;
        this.addons = data.prezzi_add_on;
        this.giorniConservazione = data.numero_giorni_conservazione;
      },
      error: (err) =>{
        console.error("Errore nel recupero degli ordini", err);
        this.mostraToast('Impossibile caricare le opzioni ordini dal server.');
      }
    })
  }

  salvaConfigurazioni() {
  const body = {
    prezzi_formati_carta: this.paperFormats,
    prezzi_metodi_stampa: this.printMethods,
    prezzi_add_on: this.addons,
    numero_giorni_conservazione: this.giorniConservazione
  };

  this.copisteriaService.updateConfigurazioni(body).subscribe({
    next: () => this.mostraToast('Configurazioni salvate con successo!'),
    error: () => this.mostraToast('Errore nel salvataggio')
  });
}

  async mostraToast(msg: string){
    const toast = await this.toastCtrl.create({message: msg, duration: 2000});
    toast.present();
  }

  async onAdd() {
    // Mostra un popup per inserire i dati in base al tab selezionato
    if (this.selectedTab === 'paper') {
      const alert = await this.alertCtrl.create({
        header: 'Nuovo Formato Carta',
        inputs: [
          { name: 'name', type: 'text', placeholder: 'Nome (es. A4)' },
          { name: 'dimensioni', type: 'text', placeholder: 'Dimensioni (es. 210x297)' },
          { name: 'price', type: 'number', placeholder: 'Prezzo (es. 0.10)', min: 0 }
        ],
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Salva',
            handler: (data) => {
              this.paperFormats.push(data);
              this.salvaConfigurazioni();
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
              this.paperFormats = this.paperFormats.filter(f => f !== item);
              this.salvaConfigurazioni();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Gestione della modifica (opzionale)
  onEdit(item: any) {
    console.log('Modifica elemento:', item);
    // Logica simile ad onAdd ma passando i dati già esistenti negli input dell'alert
  }
}



