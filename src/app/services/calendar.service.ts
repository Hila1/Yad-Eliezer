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

    constructor(private http: HttpClient,
        private _globalFunctionsService: GlobalFunctionsService) { }

    getAllEvents(bridelStaff: string = null, room: string = null): Observable<ICustomer> {
        let params = { "TypeFunction": "getAllEvents", "Params": { "bridelStaff": bridelStaff, "room": room } }

        return this.http.post<ICustomer>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }
}