import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICustomer } from '../interfaces/customer';



@Injectable()
export class CustomersService {
    
    private _url = 'http://82.166.33.42:8080/newYadEliezer/trunk/NewPhp/API/PHPBridalSalon.php'
    private headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    private options = {headers: this.headers};

    constructor(private http: HttpClient){ }

    getCustomers(): Observable<ICustomer[]>{
        let params = {'TypeFunction':'getAllPerson'};
        return this.http.post<ICustomer[]>(this._url,"object=" + JSON.stringify(params), this.options)
        .pipe(catchError(err =>{
            console.log(err);
            return Observable.throw(err);
        }))
    }

    getCustomerFileByCode(fileCode:string): Observable<ICustomer>{
        let params = {"TypeFunction":"getBridalEvent","SupportActivityId":fileCode};
        return this.http.post<ICustomer>(this._url,"object=" + JSON.stringify(params), this.options)
        .pipe(catchError(err =>{
            console.log(err);
            return Observable.throw(err);
        }))
    }
}
