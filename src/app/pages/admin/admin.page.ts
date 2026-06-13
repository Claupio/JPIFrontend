import { routes } from './admin.routes';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { AdminService } from '@services/admin-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class AdminPage implements OnInit {

  constructor(private adminService: AdminService, private route: ActivatedRoute) {

  }

  //ionViewWillEnter
  ngOnInit() {
  }

}
