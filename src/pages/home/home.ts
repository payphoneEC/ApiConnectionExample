import { SaleResponseModel } from './../../models/pay/sale-response.model';
import { RegionResponseModel } from './../../models/pay/RegionResponseModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController, Loading, LoadingController, IonicPage, AlertController, ModalController } from 'ionic-angular';
import { PayProvider } from '../../providers/pay/pay';
import { SaleResultResponseModel } from '../../models/pay/sale-result-response.model';
import { SaleRequestModel } from '../../models/pay/sale-request.model';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  payForm: FormGroup;
  loading: Loading;
  public regions: RegionResponseModel[];
  sales: SaleResultResponseModel[];

  constructor(public navCtrl: NavController, private fb: FormBuilder, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private pay: PayProvider, private storage: Storage,
  private modal: ModalController) {

      this.regions = [];
      
      storage.get('sales').then(values=>{
        this.sales = JSON.parse(values);
        if (this.sales == null || this.sales == undefined) {
          this.sales = [];
        }
      });  
  }

  ngOnInit(): void {
    this.payForm = this.fb.group({
      'phoneNumber': [null, Validators.required],
      'countryCode': [null, Validators.required]
    });    
  }

  ionViewDidLoad() {
    this.getRegions();
  }

  public submitForm($ev, value: any) {
    if (this.payForm.valid) {
      this.showLoading();

      let newSale = new SaleRequestModel();
      newSale.phoneNumber = value.phoneNumber;
      newSale.countryCode = value.countryCode;
      newSale.clientTransactionId = this.CreateGuid();
      newSale.amount = 400;
      newSale.amountWithoutTax = 400;

      this.pay.createSale(newSale).subscribe((resp: SaleResponseModel)=>{
        this.loading.dismiss();
        let sale = new SaleResultResponseModel();
        sale.transactionId = resp.transactionId;
        this.sales.push(sale);
        let aux = JSON.stringify(this.sales);
        this.storage.set('sales', aux);
        window.open('https://z7y9g.app.goo.gl/RtQw', "_system");
        this.showWait(resp.transactionId);
      }, err=>{
        if (err.errorCode == 800) {
          this.showErrorField(err.message, err);
        }else{
          this.showError(err.message);
        }        
      })
    }
  }

  getRegions(){
    this.showLoading()
    this.pay.getRegions().subscribe((resp: RegionResponseModel[])=>{
      this.loading.dismiss();
      this.regions = resp
    },err=>{
      this.showError(err.message);
    })
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

  showErrorField(text, error): void {
    this.loading.dismiss();

    let modal = this.modal.create('ErrorField', error);
    modal.present();
  }

  showWait(id: number): void {

    let modal = this.modal.create('WaitPay', {'transactionId': id, 'sales': this.sales}, {'enableBackdropDismiss': false});
    modal.present();
  }

  CreateGuid() {  
    function _p8(s) {  
       var p = (Math.random().toString(16)+"000000000").substr(2,8);  
       return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
    }  
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);  
 }  

}
 