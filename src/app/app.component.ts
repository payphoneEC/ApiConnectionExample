import { TokenResponseModel } from './../models/token/token.response.model';
import { TempProvider } from './../providers/temp/temp';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';

  private rootSource = new BehaviorSubject<string>("");
  rootObservable = this.rootSource.asObservable();

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, private temp: TempProvider) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.getMultiple(['clientId', 'secret', 'ruc', 'app']).then(values => {

        let loggedIn = (values['app'] && values['clientId'] && values['secret']) ? true : false;   
        let app = JSON.parse(values['app']) as TokenResponseModel;     
        this.temp.setToken(app == null ? "" : app.access_token);
        this.temp.setRefreshToken(app == null ? "" : app.refresh_token);
        if (loggedIn) {
          this.rootPage = 'TabsPage';
        }

      });

    });
  }

  setRoot(page: string) {
    this.rootPage = page;
    this.rootSource.next(page);
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
