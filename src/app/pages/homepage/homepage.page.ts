import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonCard, IonCardContent, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,IonFooter, IonCard, IonCardContent, ]
})
export class HomepagePage implements OnInit {

  constructor() { }

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
