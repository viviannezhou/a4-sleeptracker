import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Promise<Storage>;

  constructor(private storage: Storage) {
    // create the database once when the service starts
    this._storage = this.storage.create();
  }

  // save a value under a key
  public async set(key: string, value: any) {
    const storage = await this._storage;
    await storage.set(key, value);
  }

  // get the value saved under a key (null if nothing is saved yet)
  public async get(key: string) {
    const storage = await this._storage;
    return await storage.get(key);
  }
}