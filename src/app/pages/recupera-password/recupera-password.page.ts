import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButton, IonCard } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumatoreService } from '@services/consumatore-service';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.page.html',
  styleUrls: ['./recupera-password.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonCard]
})
export class RecuperaPasswordPage implements OnInit {

  email: string = "";

  mostraToast(msg: string, callback: any) : void {
    this.toastCtrl.create({message: msg, duration: 2000}).then((data) => {
      data.present().then(() => {callback()})
    })
  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      this.consumatoreService.recuperaPassword(this.email).subscribe({
        error: (err) => {
          this.mostraToast(err.error?.message || 'Errore server', () => this.router.navigate(["/"]))
        },
        next: (value) => {
          this.mostraToast("Se la mail è associata ad un account verrà inviato il link di recupero password", () => this.router.navigate(["/"]))
        }
      })
    }
  }

  constructor(private consumatoreService: ConsumatoreService, private route: ActivatedRoute, private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

}
