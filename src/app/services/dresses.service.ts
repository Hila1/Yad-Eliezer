import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idress } from '../interfaces/dress';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class DressesService {
    
    private _url = 'http://82.166.33.42:8080//newYadEliezer/trunk/PHP/PHPTablet/PHPBridalSalon.php'
    private headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    private options = {headers: this.headers};

    constructor(private http: HttpClient){ }

    getDresses(): Observable<Idress[]>{
        let params = {'TypeFunction':'loadBridalItem'};
        return this.http.post<Idress[]>(this._url,"object=" + JSON.stringify(params), this.options)
        .pipe(catchError(err =>{
            console.log(err);
            return Observable.throw(err);
        }))
    }

    getSingleDress(itemId:string): Observable<Idress>{
        let params = {"TypeFunction":"loadBridalItem","BridalItemId":itemId};
        return this.http.post<Idress>(this._url,"object=" + JSON.stringify(params), this.options)
        .pipe(catchError(err =>{
            console.log(err);
            return Observable.throw(err);
        }))
    }
}
