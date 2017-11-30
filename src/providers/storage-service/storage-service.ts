import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageServiceProvider {

  constructor(private storage: Storage) {
    
  }

  save(key: string, value: string){
    this.storage.set(key, value);
  }

  getByKey(key: string){
    return this.storage.get(key);
  }
}
