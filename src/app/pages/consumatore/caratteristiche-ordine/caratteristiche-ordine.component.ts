import { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, NumberSymbol } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonRadioGroup, IonRadio, IonButton, IonIcon, IonSpinner, IonInput, IonSelect, IonSelectOption, CheckboxChangeEventDetail, IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mapOutline, listOutline, checkmarkCircleOutline, businessOutline, closeOutline
} from 'ionicons/icons';
import * as L from 'leaflet';

import { ConsumatoreService } from '@services/consumatore-service';
import {RispostaPreventivo } from './copisteria.model';
import {Copisteria} from '@models/copisteria';
import {FasciaOraria} from '@models/fascia_oraria';

import * as pdfjsLib from 'pdfjs-dist';
import { IonCheckboxCustomEvent } from '@ionic/core';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href;

@Component({
  selector: 'app-caratteristiche-ordine',
  standalone: true,
  templateUrl: './caratteristiche-ordine.component.html',
  styleUrls: ['./caratteristiche-ordine.component.scss'],
  imports: [
    CommonModule, FormsModule,
    IonAccordionGroup, IonAccordion, IonItem, IonLabel,
    IonRadioGroup, IonRadio, IonButton, IonIcon, IonSpinner, IonInput, IonSelect, IonSelectOption,
    IonCheckbox
]
})
export class CaratteristicheOrdineComponent implements OnInit {
gestisciSelezione($event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>,arg1: string) {
throw new Error('Method not implemented.');
}

  @ViewChild('mapContainer') mapContainerRef?: ElementRef<HTMLDivElement>;

  
  @Output() copisteriaSelezionata = new EventEmitter<Copisteria | null>();
  
  @Output() preventivoPronto = new EventEmitter<{
    copisteria_id: number;
    formato_carta: string;
    metodo_di_stampa: string;
    add_on: string[];
    fascia: FasciaOraria;
    file: File;
    prezzoStimato: number;
    tempo_massimo_ritiro: string;
  } | null>();

  needFile=true;

  private preselezionaCopistera = () => {};
  private preselezionaFasciaOraria = () => {}

  @Input()
  set ordine(value: any) {
    if(value === null) return;

   this.preselezionaCopistera = () => {
    const a1 = this.copisterie.filter(c => c.copisteria_id == value.copisteria_id)
    if(a1.length > 0) this.selezionaCopisteria(a1[0]);
    this.preselezionaCopistera = () => {};
    this.onCampoFormCambiato();
   }

   this.preselezionaFasciaOraria = () => {
    const a2 = this.fasceOrarie.filter(f => f.inizio_fascia == value.tempo_minimo_ritiro);
    this.fasciaSelezionata = a2[0];
    this.formatoCartaScelto = value.formato_carta;
    this.metodoDiStampaScelto = value.metodo_di_stampa;
    this.numeroPagineStimato = value.numero_pagine;

    for(let add_on of JSON.parse(value.add_on)) {
      this.selezioneAddOn({detail: {checked: true}}, add_on)
    }
    
    this.preselezionaFasciaOraria = () => {};
    this.onCampoFormCambiato();
   }

   this.needFile = false;
  }

  copisterie: Copisteria[] = [];
  caricamentoInCorso = true;
  erroreCaricamento = false;

  vistaSelezione: 'accordion' | 'mappa' = 'accordion';

  copisteriaScelta: Copisteria | null = null;

  formatoCartaScelto: string | null = null;
  metodoDiStampaScelto: string | null = null;
  addOnScelto: string[] = [];
  
  @Input() numeroPagineStimato: number | null = null;
  fasciaSelezionata: FasciaOraria | null = null;

  fileSelezionato: File | null = null;
  erroreFile: string | null = null;

  fasceOrarie: FasciaOraria[] = [];
  caricamentoFasce = false;
  erroreFasce = false;

  preventivo: RispostaPreventivo | null = null;
  caricamentoPreventivo = false;
  errorePreventivo = false;

  private mappa?: L.Map;
  private markers: L.Marker[] = [];

  constructor(private consumatoreService: ConsumatoreService) {
    addIcons({ mapOutline, listOutline, checkmarkCircleOutline, businessOutline, closeOutline });
  }

  ngOnInit() {
    this.caricaCopisterie();
  }

  caricaCopisterie() {

    this.caricamentoInCorso = true;
    this.erroreCaricamento = false;

    this.consumatoreService.getCopisterie({}).subscribe({
      next: (data: Copisteria[]) => {
        this.copisterie = (data ?? []).map(c => this.normalizzaCopisteria(c));
        this.caricamentoInCorso = false;
        this.preselezionaCopistera();
      },
      error: (err: any) => {
        console.error(err);
        this.caricamentoInCorso = false;
        this.erroreCaricamento = true;
      }
    });
  }

  private normalizzaCopisteria(c: Copisteria): Copisteria {
    const parse = (v: any) => typeof v === 'string' ? JSON.parse(v || '{}') : (v ?? {});
    return {
      ...c,
      prezzi_formati_carta: parse(c.prezzi_formati_carta),
      prezzi_metodi_stampa: parse(c.prezzi_metodi_stampa),
      prezzi_add_on: parse(c.prezzi_add_on)
    };
  }

  opzioni(mappa: Record<string, number> | string | undefined): string[] {
    if (!mappa || typeof mappa === 'string') return [];
    return Object.keys(mappa);
  }

  cambiaVista(vista: 'accordion' | 'mappa') {
    this.vistaSelezione = vista;
    if (vista === 'mappa') {
      setTimeout(() => this.inizializzaOAggiornaMappa(), 50);
    }
  }

  private inizializzaOAggiornaMappa() {
    if (!this.mapContainerRef) return;

    if (!this.mappa) {
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
      this.mappa = L.map(this.mapContainerRef.nativeElement).setView([38.1157, 13.3615], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.mappa);
    }

    this.disegnaMarkerCopisterie();
    setTimeout(() => this.mappa?.invalidateSize(), 0);
  }

  private disegnaMarkerCopisterie() {
    if (!this.mappa) return;

    this.markers.forEach(m => m.remove());
    this.markers = [];

    const bounds: L.LatLngExpression[] = [];

    this.copisterie.forEach(copisteria => {
      if (copisteria.latitudine == null || copisteria.longitudine == null) return;

      const marker = L.marker([copisteria.latitudine, copisteria.longitudine])
        .addTo(this.mappa!)
        .bindPopup(`<strong>${copisteria.nome}</strong><br>${copisteria.indirizzo}`);

      marker.on('click', () => this.selezionaCopisteria(copisteria));

      this.markers.push(marker);
      bounds.push([copisteria.latitudine, copisteria.longitudine]);
    });

    if (bounds.length) {
      this.mappa.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [30, 30] });
    }
  }

  get nessunaCopisteriaConCoordinate(): boolean {
    return this.copisterie.length > 0 &&
      this.copisterie.every(c => !c.latitudine || !c.longitudine);
  }

  selezionaCopisteria(copisteria: Copisteria) {
    this.copisteriaScelta = copisteria;
    this.resetForm();
    this.copisteriaSelezionata.emit(copisteria);
    this.caricaFasceOrarie(copisteria.copisteria_id);
  }

  //METODO AGGIUNTO
  selezioneAddOn(event: any, item: string) {
    const isChecked = event.detail.checked;

    if (isChecked) {
      // Aggiunge l'elemento se non è già presente
      if (!this.addOnScelto.includes(item)) {
        this.addOnScelto.push(item);
      }
    } else {
      // Rimuove l'elemento filtrando l'array
      this.addOnScelto = this.addOnScelto.filter(el => el !== item);
    }
  }

  private caricaFasceOrarie(copisteriaId: number) {
    this.caricamentoFasce = true;
    this.erroreFasce = false;
    this.fasceOrarie = [];

    // Stesso schema filtro di json_to_query_filter.js usato altrove nell'app
    this.consumatoreService.getFasceOrarie({ copisteria_id: { eq: copisteriaId } }).subscribe({
      next: (data: FasciaOraria[]) => {
        this.fasceOrarie = data ?? [];
        this.fasceOrarie = this.fasceOrarie.filter((f, j, a) => {
          for(let i = 0; i < this.copisteriaScelta!.numero_giorni_conservazione; ++i) {
              while(true) {
                  if(a[j + 1] === undefined) return false;

                  const d1 = new Date(a[j].inizio_fascia);
                  const d2 = new Date(a[j + 1].inizio_fascia);

                  j += 1;

                  if(d1.getUTCFullYear() < d2.getUTCFullYear() || d1.getUTCMonth() < d2.getUTCMonth() || d1.getUTCDate() < d2.getUTCDate()) {
                      break;
                  }
              }
          }

          return true;
        });

        this.caricamentoFasce = false;
        this.preselezionaFasciaOraria();
      },
      error: (err: any) => {
        console.error(err);
        this.caricamentoFasce = false;
        this.erroreFasce = true;
      }
    });
  }

  confrontaFasce = (a: FasciaOraria | null, b: FasciaOraria | null): boolean => {
    if (!a || !b) return a === b;
    return a.inizio_fascia === b.inizio_fascia && a.fine_fascia === b.fine_fascia;
  };

  async onFileSelezionato(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.type !== 'application/pdf') {
      this.erroreFile = 'Il file deve essere un PDF.';
      this.fileSelezionato = null;
    } else {
      this.erroreFile = null;
      this.fileSelezionato = file;
    }

    const typedArray = new Uint8Array(await file!.arrayBuffer());

    const loadingTask = pdfjsLib.getDocument({data: typedArray});
    const pdf = await loadingTask.promise;
    this.numeroPagineStimato = pdf.numPages;

    this.onCampoFormCambiato();
  }

  deselezionaCopisteria() {
    this.copisteriaScelta = null;
    this.resetForm();
    this.copisteriaSelezionata.emit(null);
  }

  private resetForm() {
    this.formatoCartaScelto = null;
    this.metodoDiStampaScelto = null;
    this.addOnScelto = [];
    this.numeroPagineStimato = null;
    this.fasciaSelezionata = null;
    this.fileSelezionato = null;
    this.erroreFile = null;
    this.fasceOrarie = [];
    this.erroreFasce = false;
    this.preventivo = null;
    this.preventivoPronto.emit(null);
  }

  onCampoFormCambiato() {
    this.preventivo = null;
    this.preventivoPronto.emit(null);

    if (!this.moduloCompleto()) return;

    this.caricamentoPreventivo = true;
    this.errorePreventivo = false;

    this.consumatoreService.richiediPreventivo({
      copisteria_id: this.copisteriaScelta!.copisteria_id,
      formato_carta: this.formatoCartaScelto!,
      metodo_di_stampa: this.metodoDiStampaScelto!,
      numero_pagine: this.numeroPagineStimato!,
      add_on: this.addOnScelto,
      inizio_fascia_minima: this.fasciaSelezionata!.inizio_fascia
    }).subscribe({
      next: (risposta: RispostaPreventivo) => {
        this.preventivo = risposta;
        this.caricamentoPreventivo = false;
        this.preventivoPronto.emit({
          copisteria_id: this.copisteriaScelta!.copisteria_id,
          formato_carta: this.formatoCartaScelto!,
          metodo_di_stampa: this.metodoDiStampaScelto!,
          add_on: this.addOnScelto,
          fascia: this.fasciaSelezionata!,
          file: this.fileSelezionato!,
          prezzoStimato: risposta.prezzo,
          tempo_massimo_ritiro: risposta.tempo_massimo_ritiro
        });
      },
      error: (err: any) => {
        console.error(err);
        this.caricamentoPreventivo = false;
        this.errorePreventivo = true;
      }
    });
  }

  moduloCompleto(): boolean {
    return !!this.formatoCartaScelto &&
      !!this.metodoDiStampaScelto &&
      !!this.fasciaSelezionata &&
      (!this.needFile || !!this.fileSelezionato);
  }
}
