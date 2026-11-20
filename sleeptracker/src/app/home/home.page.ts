import { Component } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepComponent } from '../modals/log-sleep/log-sleep.component';
import { LogSleepinessComponent } from '../modals/log-sleepiness/log-sleepiness.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel],
})
export class HomePage {
  constructor(public sleepService:SleepService, private modalController:ModalController) {

	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	// temporary: adds a sleepiness log so we can test saving
	addTestLog() {
		this.sleepService.logSleepinessData(new StanfordSleepinessData(3));
	}
	
	// open the log sleep modal, then save the night if they tapped Save
	openLogSleep() {
		this.modalController.create({
			component: LogSleepComponent
		}).then((modal) => {
			modal.present();
			modal.onDidDismiss().then((result) => {
				if (result.role === 'save') {
					this.sleepService.logOvernightData(new OvernightSleepData(result.data.bedtime, result.data.wakeTime));
				}
			});
		});
	}

	// open the log sleepiness modal, then save the rating if they tapped Save
	openLogSleepiness() {
		this.modalController.create({
			component: LogSleepinessComponent
		}).then((modal) => {
			modal.present();
			modal.onDidDismiss().then((result) => {
				if (result.role === 'save') {
					this.sleepService.logSleepinessData(new StanfordSleepinessData(result.data.value, result.data.loggedAt));
				}
			});
		});
	}
}
