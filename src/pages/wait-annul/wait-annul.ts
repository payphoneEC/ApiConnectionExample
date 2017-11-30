import { AnnulWaitResponseModel } from './../../models/annul/annul-wait-response.model';
import { AnnulProvider } from './../../providers/annul/annul';
import { SaleResultResponseModel } from './../../models/pay/sale-result-response.model';
import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, IonicPage, ToastController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the WaitAnnulPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wait-annul',
  templateUrl: 'wait-annul.html',
})
export class WaitAnnulPage {

  isBusy: boolean;

  public id: number;
  private sales: SaleResultResponseModel[];
  private statusTimer: any;
  private timeOut: any;
  private count: number = 0;

  constructor(public viewCtrl: ViewController, public platform: Platform,
    public params: NavParams, private annul: AnnulProvider, public toastCtrl: ToastController, private storage: Storage,
    private alertCtrl: AlertController, private event: Events) {
    this.id = this.params.get('transactionId');
    this.sales = this.params.get('sales');


  }

  ngOnInit(): void {
    this.statusTimer = setInterval(this.getStatus, 5000, this);
    this.timeOut = setTimeout(() => {
      clearInterval(this.statusTimer);
      this.showAlert('Exceeded Time', 'The wait was canceled because it exceeds the time limit');      
    }, 240000);
    this.isBusy = true;
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.isBusy = false;
  }

  getStatus($that: WaitAnnulPage) {
    if ($that.id != 0) {
      $that.annul.getAnnul($that.id).subscribe((resp: AnnulWaitResponseModel) => {
        for (let index = 0; index < $that.sales.length; index++) {
          if ($that.sales[index].transactionId == resp.sale.id) {
            $that.sales[index].statusCode = resp.sale.statusCode;
            $that.sales[index].transactionStatus = resp.sale.status;
            break;
          }
        }

        if (resp.statusCode == 2 || resp.statusCode == 3) {
          clearInterval($that.statusTimer);
          $that.event.publish('annul:result', resp);
          $that.storage.set('sales', JSON.stringify($that.sales));
          $that.showAlert('Transaction Result', `The annul was ${resp.status} and the sale actual status is ${resp.sale.status}`);
        }
      }, err => {
        $that.presentToast(err.message);
        if ($that.count > 3) {
          clearInterval($that.statusTimer);
          clearTimeout($that.timeOut);
          $that.showAlert('Fail', 'We attemp to connect to PayPhone for 3 time and not receive a suscess response');
        } else {
          $that.count++;
        }
      });
    } else {
      clearInterval($that.statusTimer);
      clearTimeout($that.timeOut);
      $that.showAlert('Fail', 'The transaction id was zero');
    }

  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  showAlert(title: string, text: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present().then(resp => {
      this.dismiss();
    });
  }

}
