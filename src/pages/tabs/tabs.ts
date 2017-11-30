import { LoginPage } from './../login/login';
import { LoginProvider } from './../../providers/login/login';
import { IonicPage, NavController } from 'ionic-angular';
import { Component } from '@angular/core';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'AboutPage';
  tab3Root = 'ContactPage';

  constructor(private login: LoginProvider, private nav: NavController) {

  }

  signOut(){
    this.login.logout();
    this.nav.setRoot(LoginPage);
  }
}
