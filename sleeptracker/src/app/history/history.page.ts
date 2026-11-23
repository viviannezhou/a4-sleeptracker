import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, cafeOutline, trashOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon,
    IonItemSliding, IonItemOptions, IonItemOption, IonSegment, IonSegmentButton],
})
export class HistoryPage {
	// which filter is selected: 'all', 'sleep', or 'sleepiness'
	filter:string = 'all';

	constructor(private sleepService:SleepService, private toastController:ToastController) {
		// register the icons used in the list (Lecture 13, slide 21)
		addIcons({ bedOutline, cafeOutline, trashOutline });
	}

	// the logs to show, based on the filter, newest first
	get logs():SleepData[] {
		let list:SleepData[];
		if (this.filter === 'sleep') {
			// copy the overnight sleep list
			list = [...SleepService.AllOvernightData];
		} else if (this.filter === 'sleepiness') {
			// copy the sleepiness list
			list = [...SleepService.AllSleepinessData];
		} else {
			// copy the list of all logs
			list = [...SleepService.AllSleepData];
		}
		return list.sort((a, b) => this.timeOf(b) - this.timeOf(a));
	}

	// a night is sorted by when you woke up, a check-in by when you logged it
	private timeOf(log:SleepData):number {
		if (log instanceof OvernightSleepData) {
			return log.SleepEnd.getTime();
		}
		return log.loggedAt.getTime();
	}

	// used in the HTML to pick the right icon
	isOvernight(log:SleepData):boolean {
		return log instanceof OvernightSleepData;
	}

	// delete a log, with an Undo button in case it was a mistake (uh-oh button)
	deleteLog(log:SleepData) {
		this.sleepService.deleteLog(log);
		this.toastController.create({
			message: 'Log deleted',
			duration: 4000,
			position: 'top',
			buttons: [{
				text: 'Undo',
				handler: () => {
					this.sleepService.restoreLog(log);
				}
			}]
		}).then((toast) => {
			toast.present();
		});
	}
}