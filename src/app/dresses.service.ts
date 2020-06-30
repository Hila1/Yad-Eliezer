import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idress } from './dress';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class DressesService {
    
    private _url = 'http://82.166.33.42:8080//newYadEliezer/testtrunk/PHP/PHPTablet/PHPBridalSalon.php'
    private params = {'TypeFunction':'loadBridalItem'}
    private headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    private options = {headers: this.headers};

    // private params = {object:{"TypeFunction":"loadBridalItem","BridalItemId":"1"}};

    constructor(private http: HttpClient){ }

    getDresses(): Observable<Idress[]>{
        return this.http.post<Idress[]>(this._url,"object=" + JSON.stringify(this.params), this.options)
        .pipe(catchError(err =>{
            return  Observable.throw(err)
        }))
    }
}
