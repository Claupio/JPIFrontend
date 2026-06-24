import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton, IonCard } from '@ionic/angular/standalone';
import { AdminService } from '@services/admin-service';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone'
import { Copisteria } from '@models/copisteria'
@Component({
  selector: 'app-copisterie',
  templateUrl: './copisterie.page.html',
  styleUrls: ['./copisterie.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, IonButton, IonCard]
})
export class CopisteriePage implements OnInit {
  aggiungiNuova() {
     this.router.navigate(["/admin/copisterie/copisteria-form/", 0])
  }

  adminService: AdminService;

  constructor(private router: Router, adminService: AdminService, private alertController: AlertController) {
    addIcons({ createOutline, trashOutline });
    this.adminService = adminService
  }

  ngOnInit() {
    this.adminService.refreshCopisterie()
  }

  ionViewWillEnter() {
    this.adminService.refreshCopisterie()
  }

  modifica(copisteria: Copisteria) {
    this.router.navigate(["/admin/copisterie/copisteria-form/", copisteria.copisteria_id])
  }

  async elimina(copisteria: Copisteria) {
    const alert = await this.alertController.create({
      header: 'Conferma Eliminazione',
      message: `Sei sicuro di voler eliminare la **${copisteria.nickname}**? Questa azione non è reversibile.`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminazione annullata');
          }
        },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.adminService.eliminaCopisteria(copisteria.copisteria_id).subscribe({
              error(err) {
                console.log(err)
              },
              next: (value) => {
              },
            })
          }
        }
      ]
    });

    await alert.present();

  }

}
