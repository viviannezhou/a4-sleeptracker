import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem, IonLabel,
  IonDatetime, IonDatetimeButton, IonModal, IonNote, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.component.html',
  styleUrls: ['./log-sleep.component.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonList, IonItem,
    IonLabel, IonDatetime, IonDatetimeButton, IonModal, IonNote],
})
export class LogSleepComponent {
  // the pickers use date strings like "2026-11-20T07:00:00"
  bedtime:string;
  wakeTime:string;

  constructor(private modalController:ModalController) {
    // default to a typical night: 11pm last night to 7am today, so most people only adjust slightly
    let bed = new Date();
    bed.setDate(bed.getDate() - 1);
    bed.setHours(23, 0, 0, 0);
    let wake = new Date();
    wake.setHours(7, 0, 0, 0);
    this.bedtime = this.toLocalString(bed);
    this.wakeTime = this.toLocalString(wake);
  }

  // how long they slept, in hours
  get hoursSlept():number {
    return (new Date(this.wakeTime).getTime() - new Date(this.bedtime).getTime()) / (1000 * 60 * 60);
  }

  // error prevention: only allow saving when wake-up is after bedtime and the night is under 24 hours
  get isValid():boolean {
    // valid if they slept more than 0 hours and less than 24 hours
    return this.hoursSlept > 0 && this.hoursSlept < 24;
  }

  // uh-oh button: close without saving
  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  // send the times back to the page that opened this modal
  save() {
    this.modalController.dismiss({ bedtime: new Date(this.bedtime), wakeTime: new Date(this.wakeTime) }, 'save');
  }

  // turns a Date into a local "YYYY-MM-DDTHH:mm:ss" string for the picker
  private toLocalString(date:Date):string {
    let local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19);
  }
}