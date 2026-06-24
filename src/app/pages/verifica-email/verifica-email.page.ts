import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonButton } from '@ionic/angular/standalone';
import { ConsumatoreService } from '@services/consumatore-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verifica-email',
  templateUrl: './verifica-email.page.html',
  styleUrls: ['./verifica-email.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonButton]
})
export class VerificaEmailPage implements OnInit {

  token: string="";
  esito: string="token di verifica mail non valido";
  esito2: string="torna alla schermata iniziale"
  constructor(private consumatoreService : ConsumatoreService, private route : ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;

    this.consumatoreService.verificaMail(this.token).subscribe({
      error: (err) => {
          this.esito = err.error?.message || 'Errore verifica mail'
      },

      next: (value) => {
        this.esito = value.message
        this.esito2 = "Accedi"
      }
    })
  }

  pulsante() {
    this.router.navigate([this.esito2 === "Accedi" ? "/login" : "/"])
  }

}
