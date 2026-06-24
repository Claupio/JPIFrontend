import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard } from '@ionic/angular/standalone';
import { ConsumatoreService } from '@services/consumatore-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verifica-email',
  templateUrl: './verifica-email.page.html',
  styleUrls: ['./verifica-email.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard]
})
export class VerificaEmailPage implements OnInit {

  token: string="";
  esito: string="token di verifica mail non valido";
  constructor(private consumatoreService : ConsumatoreService, private route : ActivatedRoute) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;

    this.consumatoreService.verificaMail(this.token).subscribe({
      error: (err) => {
          this.esito = err.error?.message || 'Errore verifica mail'
      },

      next: (value) => {
        this.esito = value.message
      }
    })
  }

}
