import { CopisteriaService } from './../../services/copisteria-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonApp } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import {  documentTextOutline,
  timeOutline,
  documentOutline,
  podiumOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-copisteria',
  templateUrl: './copisteria.page.html',
  styleUrls: ['./copisteria.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton]
})
export class CopisteriaPage implements OnInit {

  tabSelezionata: string = 'tab1';

  constructor(private route: ActivatedRoute, private copisteriaService: CopisteriaService) {
    addIcons({  documentTextOutline, documentOutline, timeOutline, podiumOutline, settingsOutline });
  }

  ngOnInit() {
    
  }
}
