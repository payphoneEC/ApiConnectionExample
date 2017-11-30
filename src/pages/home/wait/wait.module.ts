import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaitPay } from './wait';


@NgModule({
  declarations: [
    WaitPay
  ],
  imports: [ 
    IonicPageModule.forChild(WaitPay),   
  ],
  entryComponents: [
    WaitPay
  ]
})
export class ErrorFilterModule {

}