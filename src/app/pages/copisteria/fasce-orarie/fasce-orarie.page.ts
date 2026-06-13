import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-fasce-orarie',
  templateUrl: './fasce-orarie.page.html',
  styleUrls: ['./fasce-orarie.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FasceOrariePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
