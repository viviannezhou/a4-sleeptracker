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
			// nothing saved yet, so a new user starts with an empty app
			return;
		}

		// storage gives back plain data, so rebuild each night into a real OvernightSleepData object
		for(let saved of savedOvernight ?? []) {
			let night = new OvernightSleepData(new Date(saved.start), new Date(saved.end));
			night.id = saved.id;
			night.loggedAt = new Date(saved.loggedAt);
			night.note = saved.note ?? ''; // older logs saved before notes existed won't have one
			SleepService.AllSleepData.push(night);
			SleepService.AllOvernightData.push(night);
		}

		// do the same for each saved sleepiness log
		for(let saved of savedSleepiness ?? []) {
			let log = new StanfordSleepinessData(saved.value, new Date(saved.loggedAt));
			log.id = saved.id;
			log.loggedAt = new Date(saved.loggedAt);
			log.note = saved.note ?? ''; // older logs saved before notes existed won't have one
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
			note: night.note,
		}));

		let sleepiness = SleepService.AllSleepinessData.map((log) => ({
			id: log.id,
			loggedAt: log.loggedAt.toISOString(),
			value: log.LoggedValue,
			note: log.note,
		}));

		this.storage.set('overnight', overnight);
		this.storage.set('sleepiness', sleepiness);
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

	// remove a log everywhere it appears, then save
	public deleteLog(log:SleepData) {
		SleepService.AllSleepData = SleepService.AllSleepData.filter((item) => item.id !== log.id);
		// same filter for AllOvernightData or AllSleepinessData depending on the type of log
		if(log instanceof OvernightSleepData) {
			SleepService.AllOvernightData = SleepService.AllOvernightData.filter((item) => item.id !== log.id);
		} else if(log instanceof StanfordSleepinessData) {
			SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter((item) => item.id !== log.id);
		}
		this.saveToStorage();
	}

	// put a deleted log back (used by the Undo button)
	public restoreLog(log:SleepData) {
		if (log instanceof OvernightSleepData) {
			this.logOvernightData(log);
		} else if (log instanceof StanfordSleepinessData) {
			this.logSleepinessData(log);
		}
	}
}