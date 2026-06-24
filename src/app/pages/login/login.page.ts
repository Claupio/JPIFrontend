import { LoginService } from './../../services/login-service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle,IonCardContent, IonNote,IonIcon, } from '@ionic/angular/standalone';
import{addIcons} from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AdminService } from '@services/admin-service';
import { CopisteriaService } from '@services/copisteria-service';

@Component({
  selector: 'app-schermata-iniziale',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonButton, IonCard, IonCardHeader,IonCardTitle,IonCardContent, IonNote, IonIcon,]

})
export class LoginPage implements OnInit {
  isPressed = false;

  userData = {
    name: "", password: ""
  }

  constructor( private loginService: LoginService, private router: Router, private adminService: AdminService, private copisteria_service: CopisteriaService) {
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

  onSubmit(form: NgForm) {
    if(form.valid) {
      this.loginService.login(this.userData.name, this.userData.password).subscribe({
        error: (err) => {
          alert("login fallita")
        },
        next: (value) => {
          const {token} = value;
          if(this.userData.name.startsWith("copisteria.")) {
            this.copisteria_service.setToken(token);
            this.router.navigate(["/copisteria"]);
          } else if(this.userData.name.startsWith("admin.")) {
            this.adminService.setToken(token)
            this.router.navigate(["/admin"]);
          }


        },
        complete: () => {

        }

      })
    }
    console.log(this.userData)
  }

}
