import { AnnulResponseModel } from './../../models/annul/annul-response.model';
import { AnnulProvider } from './../../providers/annul/annul';
import { SaleResultResponseModel } from './../../models/pay/sale-result-response.model';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, ModalController, LoadingController, ToastController, Events } from 'ionic-angular';
import { AnnulRequestModel } from '../../models/annul/annul-request.model';
import { AnnulWaitResponseModel } from '../../models/annul/annul-wait-response.model';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage implements OnInit {
  

  public sale: SaleResultResponseModel;
  public sales: SaleResultResponseModel[];
  loading: Loading;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public annul: AnnulProvider,
    private alertCtrl: AlertController, private modal: ModalController, private loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private event: Events) {
    this.sale = navParams.get('sale');
    this.sales = navParams.get('sales');

    
  }

  ngOnInit(): void {
    this.event.subscribe('annul:result', (resp: AnnulWaitResponseModel)=>{
      this.sale.transactionStatus = resp.sale.status;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  annulClick(id: number) {
    if (id > 0) {
      this.showLoading();
      let model: AnnulRequestModel = {
        id: id
      };
      this.annul.set(model).subscribe((resp: AnnulResponseModel) => {
        this.loading.dismiss();
        window.open('https://z7y9g.app.goo.gl/RtQw', "_system");
        this.showWait(resp.id);
      }, err => {
        this.showErrorField(err);
      });
    } else {
      this.presentToast('The transaction id can not be zero');
    }

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text): void {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorField(error): void {    
    if (error.errors) {
      this.loading.dismiss();
      let modal = this.modal.create('ErrorField', error);
      modal.present();
    }else{
      this.showError(error.message);
    }
    
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  showWait(id: number): void {
    let modal = this.modal.create('WaitAnnulPage', { 'transactionId': id, 'sales': this.sales }, { 'enableBackdropDismiss': false });
    modal.present();    
  }
}
