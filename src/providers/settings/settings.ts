
import { Injectable } from '@angular/core';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  public resourcePath: string;
  constructor() {
    this.resourcePath = 'https://payphone-payments.azurewebsites.net';
  }

}
