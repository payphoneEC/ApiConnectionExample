import { CancelRequestModel } from './../../../models/cancel/cancel-request.model';
import { PayProvider } from './../../../providers/pay/pay';
import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, ViewController, IonicPage, ToastController, AlertController } from 'ionic-angular';
import { SaleResultResponseModel } from '../../../models/pay/sale-result-response.model';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'wait-pay',
    templateUrl: 'wait.html'
})

export class WaitPay implements OnInit {
    isBusy: boolean;

    public id: number;
    private sales: SaleResultResponseModel[];
    private statusTimer: any;
    private timeOut: any;
    private count: number = 0;

    constructor(public viewCtrl: ViewController, public platform: Platform,
        public params: NavParams, private pay: PayProvider, public toastCtrl: ToastController, private storage: Storage,
        private alertCtrl: AlertController) {
        this.id = this.params.get('transactionId');
        this.sales = this.params.get('sales');
    }

    ngOnInit(): void {
        this.statusTimer = setInterval(this.getStatus, 5000, this);
        this.timeOut = setTimeout(() => {
            clearInterval(this.statusTimer);
          }, 240000);
        this.isBusy = true;
    }

    dismiss() {
        this.viewCtrl.dismiss();
        this.isBusy = false;
    }

    getStatus($that: WaitPay) {
        if ($that.id != 0) {
            $that.pay.getSaleById($that.id).subscribe((resp: SaleResultResponseModel) => {
                for (let index = 0; index < $that.sales.length; index++) {
                    if ($that.sales[index].transactionId == $that.id) {
                        $that.sales[index] = resp;
                        break;
                    }                
                }
    
                if (resp.statusCode == 2 || resp.statusCode == 3) {
                    clearInterval($that.statusTimer);
                    $that.storage.set('sales', JSON.stringify($that.sales));
                    $that.showAlert(resp.transactionStatus, resp.message == null ? 'The sale was approved' : resp.message);
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
        }else{
            clearInterval($that.statusTimer);
            clearTimeout($that.timeOut);
            $that.showAlert('Fail', 'The transaction id was zero');
        }
        
    }

    cancel(){
        let model: CancelRequestModel = {
            id: this.id
        };
        this.pay.cancel(model).subscribe(resp=>{
            if (resp == true) {
                clearInterval(this.statusTimer);
                clearTimeout(this.timeOut);
                this.presentToast('The sale was canceled');
                this.dismiss();
            }else{
                this.presentToast('The sale can not be canceled')
            }
        }, err=>{
            this.presentToast(err.message);
        })
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
        alert.present().then(resp=>{
            this.dismiss();
        });
      }

}
