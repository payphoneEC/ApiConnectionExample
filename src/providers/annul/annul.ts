import { AnnulResponseModel } from './../../models/annul/annul-response.model';
import { SettingsProvider } from './../settings/settings';
import { BaseConnection } from './../base.connection';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TempProvider } from './../temp/temp';
import { Http, Response } from '@angular/http';
import { AnnulRequestModel } from '../../models/annul/annul-request.model';
import { AnnulWaitResponseModel } from '../../models/annul/annul-wait-response.model';

/*
  Generated class for the AnnulProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnnulProvider extends BaseConnection {

  constructor(http: Http, settings: SettingsProvider, tempS: TempProvider) {
    super(http, settings, tempS);
    
  }

  set(model: AnnulRequestModel): Observable<AnnulResponseModel>{
    return this.post(`${this.settings.resourcePath}/api/annul`, model)
    .map((resp: Response)=><AnnulResponseModel>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error')); 
  }

  getAnnul(id: number): Observable<AnnulWaitResponseModel>{
    return this.get(`${this.settings.resourcePath}/api/annul/${id}`)
    .map((resp: Response)=><AnnulWaitResponseModel>resp.json())
    .catch((error: Response) => Observable.throw(error.json() || 'Server error'));
  }

}
