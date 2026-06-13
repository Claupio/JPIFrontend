import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonApp } from '@ionic/angular/standalone';

@Component({
  selector: 'app-copisteria',
  templateUrl: './copisteria.page.html',
  styleUrls: ['./copisteria.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonApp]
})
export class CopisteriaPage implements OnInit {

  tabSelezionata: string = 'tab1';

  constructor() { }

  ngOnInit() {
  }
}
