import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-archivio-statistiche',
  templateUrl: './archivio-statistiche.page.html',
  styleUrls: ['./archivio-statistiche.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ArchivioStatistichePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
