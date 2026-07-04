import { ConsumatoreService } from '@services/consumatore-service';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonContent, IonInput, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonNote } from '@ionic/angular/standalone';
import{addIcons} from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonNote]
})
export class SignupPage implements OnInit {
  isPressed = false;

  userData = {
    name: "", email: "", password: ""
  }

  passwordRequirements = {
    hasLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false
  };

  constructor(private consumatoreService: ConsumatoreService, private router: Router, private toastCtrl: ToastController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
  }

  checkPasswordRequirements() {
    const pwd = this.userData.password || '';
    
    this.passwordRequirements.hasLength = pwd.length >= 8;
    this.passwordRequirements.hasLetter = /[A-Za-z]/.test(pwd);
    this.passwordRequirements.hasNumber = /\d/.test(pwd);
    this.passwordRequirements.hasSpecial = /[@$!%*?&]/.test(pwd);
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
      this.consumatoreService.register(this.userData.email, this.userData.password).subscribe({
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
