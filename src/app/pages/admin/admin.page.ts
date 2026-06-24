import { routes } from './admin.routes';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { AdminService } from '@services/admin-service';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {  documentTextOutline, alertCircleOutline, timeOutline, bookOutline, documentOutline, peopleOutline} from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class AdminPage implements OnInit {

  constructor(private adminService: AdminService, private route: ActivatedRoute) {
    addIcons({  documentTextOutline,
      documentOutline,
      timeOutline,
      alertCircleOutline,
      bookOutline,
      peopleOutline
    });
  }

  //ionViewWillEnter
  ngOnInit() {
  }

}
