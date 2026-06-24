import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonCol, IonRow, IonCard } from '@ionic/angular/standalone';
import { AdminService } from '@services/admin-service';

@Component({
  selector: 'app-segnalazioni',
  templateUrl: './segnalazioni.page.html',
  styleUrls: ['./segnalazioni.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard]
})
export class SegnalazioniPage implements OnInit {

  constructor(public adminService: AdminService) { }

  ngOnInit() {
    this.adminService.refreshSegnalazioni();
  }

  ionViewDidEnter() {
    this.adminService.refreshSegnalazioni();
  }

}
