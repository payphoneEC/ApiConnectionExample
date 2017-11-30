import { TokenResponseModel } from './../../models/token/token.response.model';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseConnection } from '../base.connection';
import { SettingsProvider } from '../settings/settings';
import { Storage } from '@ionic/storage';
import { TempProvider } from '../temp/temp';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider extends BaseConnection {

  private clientId: string;
  private secret: string;
  private ruc: string;
  private authenticateApp: TokenResponseModel;
  private loggedIn: boolean;

  constructor(http: Http, settings: SettingsProvider, tempS: TempProvider, private storage: Storage, private temp: TempProvider) {
    super(http, settings, tempS);

    let $that = this;
    this.getMultiple(['clientId', 'secret', 'ruc', 'app']).then(values => {

      $that.loggedIn = (values['app'] && values['clientId'] && values['secret']) ? true : false;
      $that.authenticateApp = JSON.parse(values['app']) as TokenResponseModel;
      $that.clientId = values['clientId'];
      $that.secret = values['secret'];
      $that.ruc = values['ruc'];
      // $that.temp.setToken($that.authenticateApp == null ? "" : $that.authenticateApp.access_token);
      // $that.temp.setRefreshToken($that.authenticateApp == null ? "" : $that.authenticateApp.refresh_token);

    });
}

  getToken(clientId: string, secret: string, ruc: string): Observable<TokenResponseModel> {
    let params = new URLSearchParams();
    params.set('client_id', clientId);
    params.set('client_secret', secret);
    params.set('company_code', ruc);
    params.set('grant_type', 'client_credentials');

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': navigator.language
    });

    return this.post(`${this.settings.resourcePath}/token`, params, headers)
      .map(resp => <TokenResponseModel>resp.json())
      .map((resp: TokenResponseModel) => {
        try {
          this.storage.set('clientId', clientId);
          this.storage.set('secret', secret);
          this.storage.set('ruc', ruc);

          this.storage.set('app', JSON.stringify(resp));
          this.temp.setToken(resp.access_token);
          this.temp.setRefreshToken(resp.refresh_token);
          this.authenticateApp = resp;
          return resp;
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout() {
    try {
      this.storage.remove('app');
      this.storage.remove('clientId');
      this.storage.remove('secret');
      this.storage.remove('ruc');

      this.authenticateApp = null;
      this.clientId = null,
      this.secret = null,
      this.ruc = null;

      this.loggedIn = false;
    } catch (e) {
      console.log();
    }

  }

  getMultiple(keys: string[]) {
    const promises = [];

    keys.forEach(key => promises.push(this.storage.get(key)));

    return Promise.all(promises).then(values => {
      const result = {};

      values.map((value, index) => {
        result[keys[index]] = value;
      });

      return result;
    });
  }

}
