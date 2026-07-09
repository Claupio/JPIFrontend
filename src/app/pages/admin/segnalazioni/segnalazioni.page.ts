import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonInput, IonButton, IonPopover, IonButtons } from '@ionic/angular/standalone';
import { AdminService } from '@services/admin-service';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-segnalazioni',
  templateUrl: './segnalazioni.page.html',
  styleUrls: ['./segnalazioni.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonInput, IonButton, IonPopover, IonButtons]
})
export class SegnalazioniPage implements OnInit {

  constructor(public adminService: AdminService) {
    this.adminService.filtri_segnalazioni = {copisteria_id : {eq: ''}, consumatore_id : {eq: ''}, motivazione : {like: ''}, tempo: {ge: '', le: ''}}
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.adminService.refreshSegnalazioni();
  }

  filtroIdCopoisteriaChange(event: any) {
    this.adminService.filtri_segnalazioni.copisteria_id.eq = (event.target.value ?? '').split(',',).map((s: any) => s.trim())
    this.adminService.refreshSegnalazioni();
  }

  filtroIdConsumatoreChange(event: any) {
    this.adminService.filtri_segnalazioni.consumatore_id.eq = (event.target.value ?? '').split(',',).map((s: any) => s.trim())
    this.adminService.refreshSegnalazioni();
  }

  filtroIdMotivazioneChange(event: any) {
    this.adminService.filtri_segnalazioni.motivazione.like ='%' + (event.target.value ?? '').split(',',).map((s: any) => s.trim()) + '%';
    this.adminService.refreshSegnalazioni();
  }

  async filtroTempoInfChange(datetime: any) {
    await datetime.confirm(true);

    this.adminService.filtri_segnalazioni.tempo.ge = datetime.value;

    this.adminService.refreshSegnalazioni();
  }

  async filtroTempoSupChange(datetime: any) {
    await datetime.confirm(true);

    this.adminService.filtri_segnalazioni.tempo.le = datetime.value;

    this.adminService.refreshSegnalazioni();
  }

}
