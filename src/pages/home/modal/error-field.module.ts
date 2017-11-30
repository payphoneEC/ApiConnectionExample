import { ErrorField } from './error-field';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    ErrorField
  ],
  imports: [ 
    IonicPageModule.forChild(ErrorField),   
  ],
  entryComponents: [
    ErrorField
  ]
})
export class ErrorFilterModule {

 }