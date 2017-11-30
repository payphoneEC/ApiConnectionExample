import { TempProvider } from './temp/temp';
import { SettingsProvider } from './settings/settings';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

export class BaseConnection {
    private token: string;
    private refreshToken: string;

    /**
     *
     */
    constructor(protected http: Http, protected settings: SettingsProvider, protected tempS: TempProvider, ) {
        tempS.tokenObservable.subscribe(token => {
            this.token = token;
        });

        tempS.refreshTokenObservable.subscribe(refresh => {
            this.refreshToken = refresh;
        });
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Accept-Language', navigator.language);
        if (this.token !== '') {
            headers.append('Authorization', `Bearer ${this.token}`);
        }
    }

    protected get(url, options: Headers = null) {
        let headers = new Headers();
        if (options) {
            headers = options;
        } else {
            this.createAuthorizationHeader(headers);
        }
        return this.http.get(url,
            {
                headers: headers
            }).map(response => {
                return response;
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    protected post(url: string, data: any, options: Headers = null) {
        let headers = new Headers();
        if (options) {
            headers = options;
        } else {
            this.createAuthorizationHeader(headers);
        }
        return this.http.post(url, data, {
            headers: headers
        }).map(response => {
            return response;
        }).catch(err => {
            return Observable.throw(err);
        });
    }
}