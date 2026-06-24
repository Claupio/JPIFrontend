import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {  IonContent, IonInput, IonButton, IonCard, IonCardHeader, IonCardSubtitle,IonCardTitle,IonCardContent, IonIcon} from '@ionic/angular/standalone';
import { RegistrazioneService } from '@services/registrazione-service';
import{addIcons} from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonInput, IonButton, IonCard, IonCardHeader,IonCardTitle,IonCardContent,IonIcon]
})
export class SignupPage implements OnInit {
  isPressed = false;

  userData = {
    name: "", email: "", password: ""
  }

  constructor(private registrazioneService: RegistrazioneService, private router: Router, private toastCtrl: ToastController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
  }

  showPassword(input: any) {
    this.isPressed = true;
    input.type = 'text';
  }

  hidePassword(input: any) {
    this.isPressed = false;
    input.type = 'password';
  }

  mostraToast(msg: string, callback: any) : void {
    this.toastCtrl.create({message: msg, duration: 2000}).then((data) => {
      data.present().then(() => {callback()})
    })
  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      this.registrazioneService.register(this.userData.email, this.userData.password).subscribe({
        error: (err) => {
          this.mostraToast(err.error?.message || "Registrazione Fallita", () => {})
        },
        next: (value) => {
          this.mostraToast("verificare la mail", () => { this.router.navigate(["/"]); })
        },
        complete: () => {

        }

      })
      console.log(this.userData)
    }
  }
}
