import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentAttachOutline, list, calendar, settings, barChart, time, timeOutline } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {addIcons({
      'document-attach-outline': documentAttachOutline,
      'list': list,
      'calendar': calendar,
      'settings': settings,
      'bar-chart': barChart,
      'time': time,
      'time-outline':timeOutline
    });}



}
