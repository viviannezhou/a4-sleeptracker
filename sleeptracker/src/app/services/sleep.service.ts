import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service'; 

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static Loaded:boolean = false; // so saved data only loads once 
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	// inject the storage service, then load saved data once
	constructor(private storage:StorageService) {
		if(!SleepService.Loaded) {
			SleepService.Loaded = true;
			this.loadFromStorage();
		}
	}

	// load saved logs when the app opens
	private async loadFromStorage() {
		// get the saved lists (these are null the very first time the app opens)
		let savedOvernight = await this.storage.get('overnight');
		let savedSleepiness = await this.storage.get('sleepiness');

		if(!savedOvernight && !savedSleepiness) {
			// nothing saved yet, so start with the starter code's sample data
			this.addDefaultData();
			return;
		}

		// storage gives back plain data, so rebuild each night into a real OvernightSleepData object
		for(let saved of savedOvernight ?? []) {
			let night = new OvernightSleepData(new Date(saved.start), new Date(saved.end));
			night.id = saved.id;
			night.loggedAt = new Date(saved.loggedAt);
			SleepService.AllSleepData.push(night);
			SleepService.AllOvernightData.push(night);
		}

		// do the same for each saved sleepiness log
		for(let saved of savedSleepiness ?? []) {
			let log = new StanfordSleepinessData(saved.value, new Date(saved.loggedAt));
			log.id = saved.id;
			log.loggedAt = new Date(saved.loggedAt);
			SleepService.AllSleepData.push(log);
			SleepService.AllSleepinessData.push(log);
		}
	}

	// save every log to storage (called after each change)
	private saveToStorage() {
		// turn each object into plain data that storage can hold
		let overnight = SleepService.AllOvernightData.map((night) => ({
			id: night.id,
			loggedAt: night.loggedAt.toISOString(),
			start: night.SleepStart.toISOString(),
			end: night.SleepEnd.toISOString(),
		}));

		let sleepiness = SleepService.AllSleepinessData.map((log) => ({
			id: log.id,
			loggedAt: log.loggedAt.toISOString(),
			value: log.LoggedValue,
		}));

		this.storage.set('overnight', overnight);
		this.storage.set('sleepiness', sleepiness);
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.saveToStorage(); 
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.saveToStorage(); 
	}
}