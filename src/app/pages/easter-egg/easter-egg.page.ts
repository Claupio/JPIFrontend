import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Splash {
  id: number;
  x: number;
  y: number;
  svg: SafeHtml;
  rotation: number;
  scale: number;
}

@Component({
  selector: 'app-easter-egg',
  templateUrl: './easter-egg.page.html',
  styleUrls: ['./easter-egg.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EasterEggPage implements OnInit {

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
  }

  splashes: Splash[] = [];


  createSplash(event: MouseEvent) {

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const svg = this.generateSplash();

  const splash = {
    id: Date.now(),
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    svg: this.sanitizer.bypassSecurityTrustHtml(svg),
    rotation: Math.random() * 360,
    scale: 0.7 + Math.random() * 1.2
  };

  this.splashes.push(splash);

  
  setTimeout(() => {
    const el = document.getElementById('splash-' + splash.id);
    if (el) {
      el.classList.add('fade-out');
    }

    
    setTimeout(() => {
      this.splashes = this.splashes.filter(s => s.id !== splash.id);
    }, 800);

  }, 3000);
}

  generateSplash(): string {
     const colors = [
    "#ff4d4d",
    "#00bfff",
    "#00d26a",
    "#ffd500",
    "#ff66cc",
    "#8a2be2",
    "#ff7f50"
  ];

  const color = colors[Math.floor(Math.random() * colors.length)];

  return `
  <svg xmlns="http://www.w3.org/2000/svg"
       width="150"
       height="150"
       viewBox="0 0 150 150">

    <path fill="${color}"
      d="M73 10
         C90 0 110 15 112 35
         C135 35 145 60 130 75
         C145 95 125 120 100 115
         C95 140 60 145 45 120
         C20 125 5 95 20 75
         C5 55 20 30 45 35
         C45 15 60 5 73 10Z"/>

    <circle cx="22" cy="38" r="7" fill="${color}"/>
    <circle cx="122" cy="25" r="6" fill="${color}"/>
    <circle cx="130" cy="98" r="8" fill="${color}"/>
    <circle cx="35" cy="122" r="6" fill="${color}"/>
    <circle cx="98" cy="138" r="5" fill="${color}"/>

  </svg>`;
  }

}

  


