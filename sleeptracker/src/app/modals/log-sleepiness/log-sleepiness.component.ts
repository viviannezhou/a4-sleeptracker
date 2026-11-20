import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonListHeader, IonItem, IonLabel,
  IonRadioGroup, IonRadio, IonDatetime, IonDatetimeButton, IonModal, ModalController } from '@ionic/angular/standalone';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.component.html',
  styleUrls: ['./log-sleepiness.component.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonListHeader,
    IonItem, IonLabel, IonRadioGroup, IonRadio, IonDatetime, IonDatetimeButton, IonModal],
})
export class LogSleepinessComponent {
  // the 7 levels of the Stanford Sleepiness Scale and their descriptions (from the starter data class)
  levels:number[] = [1, 2, 3, 4, 5, 6, 7];
  descriptions = StanfordSleepinessData.ScaleValues;

  // nothing is picked at first, so they have to choose on purpose
  sleepiness:number | undefined = undefined;

  // time defaults to right now, since most people log in the moment
  loggedAt:string = this.toLocalString(new Date());

  constructor(private modalController:ModalController) {}

  // uh-oh button: close without saving
  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  // send the rating and time back to the page that opened this modal
  save() {
    this.modalController.dismiss({ value: this.sleepiness, loggedAt: new Date(this.loggedAt) }, 'save');
  }

  // turns a Date into a local "YYYY-MM-DDTHH:mm:ss" string for the picker
  private toLocalString(date:Date):string {
    let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19);
  }
}