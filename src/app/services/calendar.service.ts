import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICustomer } from '../interfaces/customer';
import { GlobalFunctionsService } from './global-functions.service';

@Injectable()
export class CalendarService {

    private _url = 'http://82.166.33.42:8080/newYadEliezer/trunk/NewPhp/API/PHPBridalSalon.php'
    private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    private options = { headers: this.headers };

    bridalEventId: string;
    localElementId: string;

    constructor(private http: HttpClient) { }

    getAllEvents(bridelStaff: string = null, room: string = null): Observable<any> {
        let params = { "TypeFunction": "getAllEvents", "Params": { "bridelStaff": bridelStaff, "room": room } }

        return this.http.post<any>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }


    getJewishFullYearDates() : Observable<any> {
        // let jerusalemID = '293198'
        let hebcakURL = "https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&d=on&ss=off&mf=off&c=off&geo=geoname&geonameid=3448439&m=50&s=off"
        return this.http.get(hebcakURL)
        .pipe(catchError(err => {
            console.log(err);
            return Observable.throw(err);
        }))
    }
}