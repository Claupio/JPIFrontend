import { ConsumatoreService } from '@services/consumatore-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonInput, IonContent, IonCard, IonButton, IonIcon, IonCardHeader, IonCardTitle, IonNote } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import{addIcons} from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modifica-password-da-email',
  templateUrl: './modifica-password-da-email.page.html',
  styleUrls: ['./modifica-password-da-email.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, CommonModule, FormsModule, IonCard, IonButton, IonIcon, IonCardHeader, IonCardTitle, IonNote]
})
export class ModificaPasswordDaEmailPage implements OnInit {

  isPressed: boolean = true;
  password: string = "";
  token: string = "";

  passwordRequirements = {
    hasLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false
  };

  constructor(private consumatoreService: ConsumatoreService, private route: ActivatedRoute, private router: Router, private toastCtrl: ToastController) { 
    addIcons({ eyeOutline, eyeOffOutline });
  }

  checkPasswordRequirements() {
    const pwd = this.password || '';
    
    this.passwordRequirements.hasLength = pwd.length >= 8;
    this.passwordRequirements.hasLetter = /[A-Za-z]/.test(pwd);
    this.passwordRequirements.hasNumber = /\d/.test(pwd);
    this.passwordRequirements.hasSpecial = /[@$!%*?&]/.test(pwd);
  }

  mostraToast(msg: string, callback: any) : void {
    this.toastCtrl.create({message: msg, duration: 2000}).then((data) => {
      data.present().then(() => {callback()})
    })
  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      this.consumatoreService.modificaPasswordDaMail(this.token, this.password).subscribe({
        error: (err) => {
          this.mostraToast(err.error?.message || 'Errore modifica password', () => this.router.navigate(["/"]))
        },
        next: (value) => {
          this.mostraToast(value.message, () => this.router.navigate(["/"]))
        }
      })
    }
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token')!;
  }

  showPassword(input: any) {
    this.isPressed = true;
    input.type = 'text';
  }

  hidePassword(input: any) {
    this.isPressed = false;
    input.type = 'password';
  }

}
