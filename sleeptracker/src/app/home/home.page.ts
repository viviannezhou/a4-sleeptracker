import { Component } from '@angular/core';
import { ModalController, ToastController, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem,
  IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, cafeOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepComponent } from '../modals/log-sleep/log-sleep.component';
import { LogSleepinessComponent } from '../modals/log-sleepiness/log-sleepiness.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge],
})
export class HomePage {
	// descriptions for each sleepiness level, used under each check-in
	descriptions = StanfordSleepinessData.ScaleValues;

	constructor(public sleepService:SleepService, private modalController:ModalController, private toastController:ToastController) {
		// register the icons used on the buttons
		addIcons({ bedOutline, cafeOutline });
	}

	// the most recent night of sleep (the one that ended latest), or undefined if none are logged
	get lastNight():OvernightSleepData | undefined {
		let nights = [...SleepService.AllOvernightData];
		nights.sort((a, b) => b.SleepEnd.getTime() - a.SleepEnd.getTime());
		return nights[0];
	}

	// sleepiness logs from today only, earliest first
	get todaysCheckIns():StanfordSleepinessData[] {
		let today = new Date().toDateString();
		return SleepService.AllSleepinessData.filter((log) => log.loggedAt.toDateString() === today)
			.sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
	}

	// formats a time like "11:00 PM"
	timeString(date:Date):string {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}

	// shows a short confirmation at the bottom of the screen (lecture 13 toast example)
	showToast(message:string) {
		this.toastController.create({
			message: message,
			duration: 2000,
			position: 'top'
		}).then((toast) => {
			toast.present();
		});
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
					this.showToast('Sleep logged');
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
					// show a toast saying the check-in was saved
					this.showToast('Check-in saved');
				}
			});
		});
	}
}