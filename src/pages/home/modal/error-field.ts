import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'error-field',
    templateUrl: 'error-field.html'
})

export class ErrorField {

    public errors: any;
    /**
     *
     */
    constructor(public viewCtrl: ViewController, public platform: Platform,
        public params: NavParams) {

        this.errors = this.params.get('errors');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}