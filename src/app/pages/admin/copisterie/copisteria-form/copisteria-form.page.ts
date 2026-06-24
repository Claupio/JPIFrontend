import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';
import {Copisteria} from '@models/copisteria'
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '@services/admin-service';
import * as L from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-copisteria-form',
  templateUrl: './copisteria-form.page.html',
  styleUrls: ['./copisteria-form.page.scss'],
  standalone: true,
  imports: [IonInput, IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonButton, IonIcon]
})
export class CopisteriaFormPage implements OnInit {
  
  private map!: L.Map;
  private marker!: L.Marker;

  onSubmit(form: NgForm) {
    if(form.valid) {
      (this.copisteria.copisteria_id ?
      this.adminService.modificaCopisteria(this.copisteria, this.password) :
      this.adminService.creaCopisteria(this.copisteria, this.password)).subscribe({
        error(err) {
            console.log(err)
        },

        next: (value) => {
            this.router.navigate(["/admin/copisterie"])

            if(!this.copisteria.copisteria_id) {
              this.adminService.refreshCopisterie()
            }
        },
      })

    }
  }

  copisteria: Copisteria = {
    copisteria_id: 0,
    numero_giorni_conservazione: 5,
    nome: "Copisteria di Prova",
    nickname: "test_copy",
    indirizzo: "Via Roma 12",
    latitudine: 45.4642,
    longitudine: 9.1900,
    prezzi_add_on: {},
    prezzi_formati_carta: {},
    prezzi_metodi_di_stampa: {},
    password_hash: ""
  };
  password: string="";
  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router, private httpClient: HttpClient) {
    // Fix per le icone di default di Leaflet che spesso spariscono in Angular
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  initMap() {
  // 0. forza icone da web
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],         // Dimensioni standard dell'icona blu
    iconAnchor: [12, 41],       // Il punto dell'icona che punterà alla coordinata esatta (la punta in basso)
    popupAnchor: [1, -34],      // Punto in cui si aprirà l'eventuale popup
    shadowSize: [41, 41]        // Dimensioni dell'ombra
  });

  // Applica questa configurazione a tutti i marker di default
  L.Marker.prototype.options.icon = defaultIcon;
    // 1. Inizializza la mappa sulla coordinata di partenza
    this.map = L.map('map').setView([this.copisteria.latitudine, this.copisteria.longitudine], 13);

    // 2. Aggiunge i tasselli (tiles) di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 3. Crea il singolo marker trascinabile (draggable)
    this.marker = L.marker([this.copisteria.latitudine, this.copisteria.longitudine], { draggable: true }).addTo(this.map);

    // 4. EVENTO A: L'utente trascina il marker sulla mappa
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.copisteria.latitudine = parseFloat(position.lat.toFixed(6)); // Arrotonda per pulizia visiva
      this.copisteria.longitudine = parseFloat(position.lng.toFixed(6));
    });

    // 5. EVENTO B: L'utente clicca un punto qualsiasi sulla mappa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.copisteria.latitudine = parseFloat(e.latlng.lat.toFixed(6));
      this.copisteria.longitudine = parseFloat(e.latlng.lng.toFixed(6));
      this.marker.setLatLng([this.copisteria.latitudine, this.copisteria.longitudine])
    });


  }

  onPosizioneChange() {
    this.marker.setLatLng([this.copisteria.latitudine, this.copisteria.longitudine])
  }

  private ultimoIndirizzo: string = "";
  calcolaLatitudioneLongitudineDaIndirizzo() {
    if(this.ultimoIndirizzo === this.copisteria.indirizzo) {
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.copisteria.indirizzo)}&format=json`;

    const headers = new HttpHeaders({
      'User-Agent': 'Ionic-Angular-Geocoding-App'
    });
    this.httpClient.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Dati ricevuti da Nominatim:', data);

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          this.copisteria.latitudine = lat;
          this.copisteria.longitudine = lng;

          this.ultimoIndirizzo = this.copisteria.indirizzo;

          this.map.setView([lat, lng])
          this.marker.setLatLng([lat, lng])
        } else {
          console.warn('Nessun risultato trovato per questo indirizzo.');
        }
      },
      error: (error) => {
        console.error('Errore durante la richiesta HTTP:', error);
      },
    });
  }

  ionViewDidEnter() {
    this.initMap()
  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(params => {
      const copisteria_id = params.get('copisteria_id')!;

      if(+copisteria_id) {
        this.copisteria = this.adminService.copisterie.find(c => c.copisteria_id === +copisteria_id)!
      } else {
        this.copisteria = {
    copisteria_id: 0,
    numero_giorni_conservazione: 5,
    nome: "Copisteria di Prova",
    nickname: "test_copy",
    indirizzo: "Via Roma 12",
    latitudine: 45.4642,
    longitudine: 9.1900,
    prezzi_add_on: {},
    prezzi_formati_carta: {},
    prezzi_metodi_di_stampa: {},
    password_hash: ""
  };
      }

      this.password = "";
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

}
