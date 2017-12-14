import { ITempData } from './../../interfaces/ITempData';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/*
  Generated class for the TempProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TempProvider {

  temp: ITempData;
  tempRegister: ITempData;
  private token: string;
  private refreshToken: string;
  private tokenSource = new BehaviorSubject<string>("");
  tokenObservable = this.tokenSource.asObservable();

  private refreshTokenSource = new BehaviorSubject<string>("");
  refreshTokenObservable = this.refreshTokenSource.asObservable();

  constructor() {
    
  }

  setToken(token: string) {
    this.token = token;
    this.tokenSource.next(token);
  }

  setRefreshToken(refresh: string) {
    this.refreshToken = refresh;
    this.refreshTokenSource.next(refresh);
  }

}
