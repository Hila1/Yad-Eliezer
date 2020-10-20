import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, repeatWhen, tap } from 'rxjs/operators';
import { ICustomer } from '../interfaces/customer';
import { GlobalFunctionsService } from './global-functions.service';
import { RouterLinkWithHref } from '@angular/router';
// import 'rxjs/add/observable/of';
// import '';
// import {  } from 'rxjs';


@Injectable()
export class CustomersService {

    private _url = 'http://82.166.33.42:8080/newYadEliezer/trunk/NewPhp/API/PHPBridalSalon.php'
    private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    private options = { headers: this.headers };

    bridalEventId: string;
    localElementId: string;

    constructor(private http: HttpClient,
        private _globalFunctionsService: GlobalFunctionsService) { }

    /**
     *  This function returns the value of bridalEventId,
     * if the class does't hold the correct value for some reason,
     * the function will request it's value, keep it and return its value
     */
    getBridalEventId(): Observable<any> {
        //if the server request returned already and its value is number
        if (this.bridalEventId && !isNaN(+this.bridalEventId) && this.isBridalEventIdUpdated()) {
            return of(this.bridalEventId)
        } else {
            return this.getCustomerFileByCode().pipe(
                map(data => data[0]['BridalEventId']),
                tap(res => {
                    this.bridalEventId = res;
                    this.localElementId = this._globalFunctionsService.getElementID();
                })
            )
        }
    }

    isBridalEventIdUpdated() {
        // comparing local element id to url to check whether the bridal event id (from server) is updated
        return this._globalFunctionsService.getElementID() == this.localElementId;
    }


    getCustomers(): Observable<ICustomer[]> {
        let params = { 'TypeFunction': 'getAllPerson' };
        return this.http.post<ICustomer[]>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }

    getCustomerFileByCode(): Observable<ICustomer> {
        let fileCode = this._globalFunctionsService.getElementID();
        let params = { "TypeFunction": "getBridalEvent", "SupportActivityId": fileCode };
        return this.http.post<ICustomer>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }
}
