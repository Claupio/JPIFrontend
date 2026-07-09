import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoInstagram, logoTiktok, logoYoutube } from 'ionicons/icons';
import * as L from 'leaflet';
import { ConsumatoreService } from '@services/consumatore-service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonFooter, IonCard, IonCardContent, IonIcon]
})
export class HomepagePage implements OnInit {

  private map!: L.Map;

  constructor(private consumatoreService: ConsumatoreService) {
    addIcons({ logoInstagram, logoTiktok, logoYoutube });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = defaultIcon;

    this.map = L.map('map').setView([41.8719, 12.5674], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.consumatoreService.getCopisterie({}).subscribe({
      next: (copisterie: any[]) => {
        console.log(copisterie)
        if (copisterie && copisterie.length > 0) {
          copisterie.forEach(copisteria => {
            if (copisteria.latitudine && copisteria.longitudine) {
              const marker = L.marker([copisteria.latitudine, copisteria.longitudine]).addTo(this.map);
              
              marker.bindPopup(`
                <div style="text-align:center;">
                  <strong>${copisteria.nome}</strong><br>
                  ${copisteria.indirizzo}
                </div>
              `);

              marker.addTo(this.map);
              this.map.setView([copisteria.latitudine, copisteria.longitudine],13);
              console.log(copisteria.latitudine, copisteria.longitudine);
            }
          });
        }
      },
      error: (err) => {
        console.error('Errore nel recupero delle copisterie per la mappa:', err);
      }
    });
  }

  scrollTo(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth', 
        block: 'start'      
      });
    }
  }

}
