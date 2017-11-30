import { CancelRequestModel } from './../../models/cancel/cancel-request.model';
import { SaleResultResponseModel } from './../../models/pay/sale-result-response.model';
import { Observable } from 'rxjs/Rx';
import { TempProvider } from './../temp/temp';
import { RegionResponseModel } from './../../models/pay/RegionResponseModel';
import { SettingsProvider } from './../settings/settings';
import { Http, Response } from '@angular/http';
import { BaseConnection } from './../base.connection';
import { Injectable } from '@angular/core';
import { SaleResponseModel } from '../../models/pay/sale-response.model';
import { SaleRequestModel } from '../../models/pay/sale-request.model';

/*
  Generated class for the PayProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PayProvider extends BaseConnection {

  constructor(http: Http, settings: SettingsProvider, tempS: TempProvider) {
    super(http, settings, tempS);
    
  }

  getRegions(): Observable<RegionResponseModel[]>{
    return this.get(`${this.settings.resourcePath}/api/regions`)
    .map((resp: Response)=><RegionResponseModel[]>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

  createSale(data: SaleRequestModel): Observable<SaleResponseModel>{
    return this.post(`${this.settings.resourcePath}/api/sale`, data)
    .map((resp: Response)=><SaleResponseModel>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

  getSaleById(id: number): Observable<SaleResultResponseModel>{
    return this.get(`${this.settings.resourcePath}/api/sale/${id}`)
    .map((resp: Response)=><SaleResultResponseModel>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

  cancel(model:CancelRequestModel): Observable<boolean>{
    return this.post(`${this.settings.resourcePath}/api/cancel`, model)
    .map((resp: Response)=><boolean>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

}
