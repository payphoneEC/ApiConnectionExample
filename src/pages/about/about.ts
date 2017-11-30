import { SaleResultResponseModel } from './../../models/pay/sale-result-response.model';
import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, Loading, LoadingController } from 'ionic-angular';
import { PayProvider } from '../../providers/pay/pay';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  total: number;
  itemsPerPage = 10;
  filterStatus = 0;
  search: string = '';
  page: number = 0;
  private loading: Loading;

  sales: SaleResultResponseModel[];
  saleList: SaleResultResponseModel[];

  constructor(public navCtrl: NavController, private pay: PayProvider, private storage: Storage, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
    
  }

  ionViewDidLoad() {
    this.storage.get('sales').then(values => {
      this.sales = JSON.parse(values);
      if (this.sales == null || this.sales == undefined) {
        this.sales = [];
      }
      
      this.getSales(this.page);
    });
  }

  details(id: number) {
    this.showLoading();
    this.pay.getSaleById(id).subscribe((resp: SaleResultResponseModel) => {
      for (let index = 0; index < this.sales.length; index++) {
        if (this.sales[index].transactionId == id) {
          this.sales[index] = resp;
          break;
        }
      }

      this.storage.set('sales', JSON.stringify(this.sales));

      this.navCtrl.push('DetailPage', {'sale':resp, 'sales': this.sales});
    }, err => {
      this.loading.dismiss();
      this.showError(err.message);
    })

  }

  getSales(page: number) {
    let skip = this.itemsPerPage * page;

    this.total = this.sales.length;
    this.saleList = this.sales.slice(skip, this.itemsPerPage);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.page++;
      let skip = this.itemsPerPage * this.page;

      this.total = this.sales.length;
      let aux = this.sales.slice(skip, skip + this.itemsPerPage);
      this.saleList = this.saleList.concat(aux);
      infiniteScroll.complete();
    }, 500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.page = 0;
      let skip = this.itemsPerPage * this.page;

      this.total = this.sales.length;
      this.saleList = this.sales.slice(skip, this.itemsPerPage);
      refresher.complete();
    }, 2000);
  }

  showError(text): void {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
