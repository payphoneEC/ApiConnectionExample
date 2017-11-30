import { TokenResponseModel } from './../../models/token/token.response.model';
import { LoginProvider } from './../../providers/login/login';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  loading: Loading;
  tokenForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    private fb: FormBuilder, private login: LoginProvider, private qrScanner: QRScanner) {

  }

  scanKeys() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            let keys = JSON.parse(text);
            this.tokenForm.controls['clientId'].setValue(keys.clientId);
            this.tokenForm.controls['secret'].setValue(keys.secret);
            this.qrScanner.hide().then(data => {
              this.hideCamera();
            }); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          // show camera preview
          this.qrScanner.show().then(data => {
            this.showCamera();
          });

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  showCamera() {
    // (window.document.querySelector('body') as HTMLElement).classList.add('cameraView');
    // (window.document.querySelector('html') as HTMLElement).classList.add('cameraView');
    // (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
    ionApp.style.display = 'none';
  }
  hideCamera() {
    // (window.document.querySelector('body') as HTMLElement).classList.remove('cameraView');
    // (window.document.querySelector('html') as HTMLElement).classList.remove('cameraView');
    // (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
    ionApp.style.display = 'block';
  }

  ngOnInit(): void {
    this.tokenForm = this.fb.group({
      'clientId': [null, Validators.compose([Validators.required])],
      'secret': [null, Validators.required],
      'ruc': [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public submitForm($ev, value: any) {
    $ev.preventDefault();
    if (this.tokenForm.valid) {
      this.showLoading();
      this.login.getToken(value.clientId, value.secret, value.ruc).subscribe((result: TokenResponseModel) => {
        this.navCtrl.setRoot('TabsPage');
      }, err => {
        this.showError(err.message);
      });
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
