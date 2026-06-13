import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoInstagram, logoTiktok, logoYoutube } from 'ionicons/icons';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonFooter, IonCard, IonCardContent, IonIcon]
})
export class HomepagePage implements OnInit {

  constructor() {
    addIcons({ logoInstagram, logoTiktok, logoYoutube });
  }

  ngOnInit() {
  }

  scrollTo(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth', // Fa in modo che lo scorrimento sia fluido e non a scatto
        block: 'start'      // Allinea la parte alta dell'elemento con la parte alta della vista
      });
    }
  }

}
